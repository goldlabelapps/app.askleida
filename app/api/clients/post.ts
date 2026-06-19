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

  const payload: T_Client = {
    ...(body.client_id ? { client_id: body.client_id } : {}),
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

  // If an email was provided, send a Supabase invite email for password setup.
  try {
    const email = normalizedData.email;
    if (email) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
        redirectTo: makeInviteRedirectUrl(),
        data: { access_level: 2 },
      });

      if (inviteError) {
        // ignore invite error but include info in response data
        (data as any)._auth_error = inviteError.message;
      } else if (inviteData) {
        (data as any)._auth_invite = inviteData;
      }
    }
  } catch (e) {
    // swallow errors from auth invite so client creation still succeeds
    (data as any)._auth_exception = e instanceof Error ? e.message : String(e);
  }

  const res = makeRes({ tenant, message: 'Client created', severity: 'success', data });
  return NextResponse.json(res);
}
