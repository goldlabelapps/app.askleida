import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// PATCH /api/clients - Update a client (expects { client_id, ...fields })
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

  const { client_id, ...fields } = body;
  const clientId = typeof client_id === 'string' ? client_id.trim() : '';
  if (!clientId) {
    const res = makeRes({ tenant, message: 'Missing client_id', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }

  if (fields.data !== undefined && fields.data !== null && typeof fields.data !== 'object') {
    const res = makeRes({ tenant, message: 'data must be a JSON object', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }

  const { data: existingRow, error: existingError } = await supabase
    .from('clients')
    .select('data')
    .eq('client_id', clientId)
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

  const legacyFirstName = typeof fields?.first_name === 'string' ? fields.first_name.trim() || null : undefined;
  const legacyLastName = typeof fields?.last_name === 'string' ? fields.last_name.trim() || null : undefined;
  const legacyDateOfBirth =
    typeof fields?.date_of_birth === 'string' ? fields.date_of_birth.trim() || null : undefined;
  const legacyEmail =
    typeof fields?.email === 'string' ? fields.email.trim().toLowerCase() || null : undefined;
  const profileSkinType =
    typeof fields?.skin_type === 'string' ? fields.skin_type.trim() || null : undefined;
  const profileCurrentMedication =
    typeof fields?.current_medication === 'string' ? fields.current_medication.trim() || null : undefined;
  const profileSkinOverview =
    typeof fields?.skin_overview === 'string' ? fields.skin_overview.trim() || null : undefined;
  const profilePersonalNotes =
    typeof fields?.personal_notes === 'string' ? fields.personal_notes.trim() || null : undefined;

  const dateOfBirthCandidate =
    legacyDateOfBirth ??
    (typeof incomingData.date_of_birth === 'string' ? incomingData.date_of_birth : undefined);

  if (dateOfBirthCandidate && Number.isNaN(Date.parse(dateOfBirthCandidate))) {
    const res = makeRes({
      tenant,
      message: 'date_of_birth must be a valid date string',
      severity: 'error',
    });
    return NextResponse.json(res, { status: 400 });
  }

  const mergedData = {
    ...currentData,
    ...incomingData,
  } as Record<string, unknown>;

  if (legacyFirstName !== undefined) mergedData.first_name = legacyFirstName;
  if (legacyLastName !== undefined) mergedData.last_name = legacyLastName;
  if (legacyDateOfBirth !== undefined) mergedData.date_of_birth = legacyDateOfBirth;
  if (legacyEmail !== undefined) mergedData.email = legacyEmail;
  if (profileSkinType !== undefined) mergedData.skin_type = profileSkinType;
  if (profileCurrentMedication !== undefined) mergedData.current_medication = profileCurrentMedication;
  if (profileSkinOverview !== undefined) mergedData.skin_overview = profileSkinOverview;
  if (profilePersonalNotes !== undefined) mergedData.personal_notes = profilePersonalNotes;

  const updatePayload: Record<string, unknown> = {
    data: mergedData,
  };

  if (typeof fields.title === 'string') {
    updatePayload.title = fields.title.trim() || null;
  }

  if (typeof fields.practitioner_id === 'string' && fields.practitioner_id.trim()) {
    updatePayload.practitioner_id = fields.practitioner_id.trim();
  }

  const { data, error } = await supabase
    .from('clients')
    .update(updatePayload)
    .eq('client_id', clientId)
    .select();
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }

  const res = makeRes({ tenant, message: 'Client updated', severity: 'success', data });
  return NextResponse.json(res);
}
