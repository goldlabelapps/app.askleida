import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../';

export type T_Client = {
  client_id?: string;
  practitioner_id?: string | null;
  title?: string | null;
  created?: string;
  updated?: string | null;
  data?: Record<string, unknown> | null;
  // Legacy fields accepted for backward compatibility and moved into data.
  first_name?: string | null;
  last_name?: string | null;
  date_of_birth?: string | null;
  email?: string | null;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;

function makeInviteRedirectUrl() {
  return 'https://app.askleida.com/account/invite';
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// POST /api/clients - Create a new client
export async function POST(req: Request) {
  let body: T_Client;
  try {
    body = await req.json();
  } catch {
    const res = makeRes({ tenant, message: 'Invalid JSON body', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }

  // Ensure body is a non-null object and not an array
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    const res = makeRes({ tenant, message: 'Request body must be a JSON object', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }

  // Sanitize and normalize legacy fields (moved into data)
  body.email = body.email?.trim().toLowerCase() || null;
  body.title = body.title?.trim() || null;
  body.practitioner_id = body.practitioner_id?.trim() || null;

  const errors: { field: string; message: string }[] = [];
  if (body.data !== undefined && body.data !== null && typeof body.data !== 'object') {
    errors.push({ field: 'data', message: 'data must be a JSON object' });
  }
  if (errors.length) {
    const res = makeRes({ tenant, message: 'Validation error', severity: 'error', data: errors });
    return NextResponse.json(res, { status: 400 });
  }

  const dataObject = (body.data && typeof body.data === 'object')
    ? { ...body.data }
    : {};

  // Strip deprecated profile fields from the persisted client data blob.
  delete (dataObject as Record<string, unknown>).first_name;
  delete (dataObject as Record<string, unknown>).last_name;
  delete (dataObject as Record<string, unknown>).date_of_birth;

  const normalizedData = {
    ...dataObject,
    email:
      body.email ??
      (typeof dataObject.email === 'string' ? dataObject.email.trim().toLowerCase() || null : null),
  };

  // If an email is provided, invite the auth user first so we can use their
  // UID as the client_id, keeping the auth identity and client record in sync.
  let authUserId: string | null = null;
  let authInviteError: string | null = null;

  const inviteEmail = normalizedData.email;
  if (inviteEmail) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(inviteEmail, {
        redirectTo: makeInviteRedirectUrl(),
        data: {
          access_level: 2,
        },
      });

      if (inviteError) {
        authInviteError = inviteError.message;
      } else if (inviteData?.user?.id) {
        authUserId = inviteData.user.id;
      }
    } catch (e) {
      authInviteError = e instanceof Error ? e.message : String(e);
    }
  }

  // Use the auth UID as client_id when available so the two records share the
  // same primary identifier. Fall back to any caller-supplied id or let the
  // database generate one.
  const resolvedClientId = authUserId ?? body.client_id ?? undefined;

  const payload: T_Client = {
    ...(resolvedClientId ? { client_id: resolvedClientId } : {}),
    ...(body.practitioner_id ? { practitioner_id: body.practitioner_id } : {}),
    title: body.title,
    data: normalizedData,
    ...(body.created ? { created: body.created } : {}),
    ...(body.updated ? { updated: body.updated } : {}),
  };

  const { data, error } = await supabase.from('clients').insert([payload]).select();
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }

  // Now that we have the definitive client_id, patch it into the auth user's
  // metadata so the client can resolve their own record after login.
  if (authUserId) {
    const finalClientId = (Array.isArray(data) && data[0]?.client_id) ? data[0].client_id : authUserId;
    try {
      await supabase.auth.admin.updateUserById(authUserId, {
        user_metadata: {
          access_level: 2,
          client_id: finalClientId,
        },
      });
    } catch {
      // non-fatal — metadata patch failure shouldn't block the response
    }
  }

  const resMeta = authInviteError ? { _auth_error: authInviteError } : undefined;
  const res = makeRes({ tenant, message: 'Client created', severity: 'success', data, meta: resMeta });
  return NextResponse.json(res);
}
