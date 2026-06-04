import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// PATCH /api/tips - Update a tip (expects { tip_id, ...fields })
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

  const { tip_id, ...fields } = body;
  const tipId = typeof tip_id === 'string' ? tip_id.trim() : '';
  if (!tipId) {
    const res = makeRes({ tenant, message: 'Missing tip_id', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }

  if (fields.data !== undefined && fields.data !== null && typeof fields.data !== 'object') {
    const res = makeRes({ tenant, message: 'data must be a JSON object', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }

  const { data: existingRow, error: existingError } = await supabase
    .from('tips')
    .select('data')
    .eq('tip_id', tipId)
    .single();

  if (existingError) {
    const res = makeRes({ tenant, message: existingError.message, severity: 'error' });
    return NextResponse.json(res, { status: 404 });
  }

  const currentData =
    existingRow?.data && typeof existingRow.data === 'object' ? { ...existingRow.data } : {};

  const incomingData =
    fields?.data && typeof fields.data === 'object' ? { ...fields.data } : {};

  const legacyFirstName = typeof fields?.first_name === 'string' ? fields.first_name.trim() || null : undefined;
  const legacyLastName = typeof fields?.last_name === 'string' ? fields.last_name.trim() || null : undefined;
  const legacyDateOfBirth =
    typeof fields?.date_of_birth === 'string' ? fields.date_of_birth.trim() || null : undefined;
  const legacyEmail =
    typeof fields?.email === 'string' ? fields.email.trim().toLowerCase() || null : undefined;

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

  const updatePayload = { ...fields, data: mergedData };
  delete (updatePayload as any).first_name;
  delete (updatePayload as any).last_name;
  delete (updatePayload as any).date_of_birth;
  delete (updatePayload as any).email;

  const { data, error } = await supabase
    .from('tips')
    .update(updatePayload)
    .eq('tip_id', tipId)
    .select();
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
  const res = makeRes({ tenant, message: 'Tip updated', severity: 'success', data });
  return NextResponse.json(res);
}
