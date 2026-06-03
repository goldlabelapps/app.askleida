import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../';

export type T_Tip = {
  tip_id?: string;
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
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// POST /api/tips - Create a new tip
export async function POST(req: Request) {
  let body: T_Tip;
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
  body.first_name = body.first_name?.trim() || null;
  body.last_name = body.last_name?.trim() || null;
  body.date_of_birth = body.date_of_birth?.trim() || null;
  body.practitioner_id = body.practitioner_id?.trim() || null;

  const errors: { field: string; message: string }[] = [];
  const dataDateOfBirth =
    typeof body.data?.date_of_birth === 'string' ? body.data.date_of_birth : null;
  const finalDateOfBirth = body.date_of_birth || dataDateOfBirth;
  if (finalDateOfBirth && Number.isNaN(Date.parse(finalDateOfBirth))) {
    errors.push({ field: 'date_of_birth', message: 'date_of_birth must be a valid date string' });
  }
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

  const normalizedData = {
    ...dataObject,
    first_name:
      body.first_name ??
      (typeof dataObject.first_name === 'string' ? dataObject.first_name.trim() || null : null),
    last_name:
      body.last_name ??
      (typeof dataObject.last_name === 'string' ? dataObject.last_name.trim() || null : null),
    date_of_birth:
      finalDateOfBirth ??
      (typeof dataObject.date_of_birth === 'string' ? dataObject.date_of_birth.trim() || null : null),
    email:
      body.email ??
      (typeof dataObject.email === 'string' ? dataObject.email.trim().toLowerCase() || null : null),
  };

  const payload: T_Tip = {
    tip_id: body.tip_id?.trim() || crypto.randomUUID(),
    practitioner_id: body.practitioner_id,
    title: body.title,
    data: normalizedData,
    created: body.created || new Date().toISOString(),
    updated: body.updated || new Date().toISOString(),
  };

  const { data, error } = await supabase.from('tips').insert([payload]).select();
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }

  const res = makeRes({ tenant, message: 'Tip created', severity: 'success', data });
  return NextResponse.json(res);
}
