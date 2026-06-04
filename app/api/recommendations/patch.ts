import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const normalizeText = (value: unknown): string | null | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export async function PATCH(req: Request) {
  let body: Record<string, unknown>;
  try {
    const parsed = await req.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      const res = makeRes({ tenant, message: 'Request body must be a JSON object', severity: 'error' });
      return NextResponse.json(res, { status: 400 });
    }

    body = parsed as Record<string, unknown>;
  } catch {
    const res = makeRes({ tenant, message: 'Invalid JSON body', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }

  const { recommendation_id, ...fields } = body;
  const recommendationId = typeof recommendation_id === 'string' ? recommendation_id.trim() : '';
  if (!recommendationId) {
    const res = makeRes({ tenant, message: 'Missing recommendation_id', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }

  if (fields.data !== undefined && fields.data !== null && typeof fields.data !== 'object') {
    const res = makeRes({ tenant, message: 'data must be a JSON object', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }

  const { data: existingRow, error: existingError } = await supabase
    .from('recommendations')
    .select('data')
    .eq('recommendation_id', recommendationId)
    .single();

  if (existingError) {
    const status = (existingError as any)?.code === 'PGRST116' ? 404 : 500;
    const res = makeRes({ tenant, message: existingError.message, severity: 'error' });
    return NextResponse.json(res, { status });
  }

  const currentData: Record<string, unknown> =
    existingRow?.data && typeof existingRow.data === 'object' ? { ...existingRow.data } : {};

  const incomingData: Record<string, unknown> =
    fields?.data && typeof fields.data === 'object' ? { ...fields.data } : {};

  const mergedData = {
    ...currentData,
    ...incomingData,
  } as Record<string, unknown>;

  const clientId = normalizeText(fields.client_id ?? incomingData.client_id);
  const clientName = normalizeText(fields.client_name ?? incomingData.client_name);
  const therapistContext = normalizeText(fields.therapist_context ?? incomingData.therapist_context);
  const tips = normalizeText(fields.tips ?? incomingData.tips);
  const draft = normalizeText(fields.draft ?? incomingData.draft);
  const exportUrl = normalizeText(fields.export_url ?? incomingData.export_url);

  if (clientId !== undefined) mergedData.client_id = clientId;
  if (clientName !== undefined) mergedData.client_name = clientName;
  if (therapistContext !== undefined) mergedData.therapist_context = therapistContext;
  if (tips !== undefined) mergedData.tips = tips;
  if (draft !== undefined) mergedData.draft = draft;
  if (exportUrl !== undefined) mergedData.export_url = exportUrl;

  const updatePayload: Record<string, unknown> = {
    data: mergedData,
  };

  if (typeof fields.title === 'string') {
    updatePayload.title = fields.title.trim() || null;
  } else if (clientName !== undefined) {
    updatePayload.title = clientName;
  }

  if (typeof fields.practitioner_id === 'string' && fields.practitioner_id.trim()) {
    updatePayload.practitioner_id = fields.practitioner_id.trim();
  }

  const { data, error } = await supabase
    .from('recommendations')
    .update(updatePayload)
    .eq('recommendation_id', recommendationId)
    .select();
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }

  const res = makeRes({ tenant, message: 'Recommendation updated', severity: 'success', data });
  return NextResponse.json(res);
}
