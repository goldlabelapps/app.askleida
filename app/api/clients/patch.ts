import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../';
import { setFeedback } from '../../NX/DesignSystem';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const fb = {
  title: 'Client Updated',
  description: 'The client was successfully updated.',
  severity: 'success' as const,
}

// PATCH /api/clients - Update a client (expects { client_id, ...fields })
export async function PATCH(req: Request) {
  const body = await req.json();
  const { client_id, ...fields } = body;
  if (!client_id) {
    const res = makeRes({ tenant, message: 'Missing client_id', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }

  const { data: existingRow, error: existingError } = await supabase
    .from('clients')
    .select('data')
    .eq('client_id', client_id)
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
    .from('clients')
    .update(updatePayload)
    .eq('client_id', client_id)
    .select();
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
  const res = makeRes({ tenant, message: 'Client updated', severity: 'success', data });
  return NextResponse.json(res);
}
