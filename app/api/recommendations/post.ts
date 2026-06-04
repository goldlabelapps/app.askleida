import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../';

export type T_Recommendation = {
  recommendation_id?: string;
  practitioner_id?: string | null;
  title?: string | null;
  created?: string;
  updated?: string | null;
  data?: Record<string, unknown> | null;
  client_id?: string | null;
  client_name?: string | null;
  therapist_context?: string | null;
  tips?: string | null;
  draft?: string | null;
  export_url?: string | null;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const normalizeText = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export async function POST(req: Request) {
  let body: T_Recommendation;
  try {
    body = await req.json();
  } catch {
    const res = makeRes({ tenant, message: 'Invalid JSON body', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    const res = makeRes({ tenant, message: 'Request body must be a JSON object', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }

  const dataObject = (body.data && typeof body.data === 'object')
    ? { ...body.data }
    : {};

  const clientId = normalizeText(body.client_id ?? dataObject.client_id);
  const clientName = normalizeText(body.client_name ?? dataObject.client_name);
  const therapistContext = normalizeText(body.therapist_context ?? dataObject.therapist_context);
  const tips = normalizeText(body.tips ?? dataObject.tips);
  const draft = normalizeText(body.draft ?? dataObject.draft);
  const exportUrl = normalizeText(body.export_url ?? dataObject.export_url);
  const title = normalizeText(body.title) || clientName || 'New recommendation';

  const payload: T_Recommendation = {
    ...(body.recommendation_id ? { recommendation_id: body.recommendation_id } : {}),
    ...(body.practitioner_id ? { practitioner_id: body.practitioner_id } : {}),
    title,
    data: {
      ...dataObject,
      client_id: clientId,
      client_name: clientName,
      therapist_context: therapistContext,
      tips,
      draft,
      export_url: exportUrl,
    },
    ...(body.created ? { created: body.created } : {}),
    ...(body.updated ? { updated: body.updated } : {}),
  };

  const { data, error } = await supabase.from('recommendations').insert([payload]).select();
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }

  const res = makeRes({ tenant, message: 'Recommendation created', severity: 'success', data });
  return NextResponse.json(res);
}
