import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// PATCH /api/practitioner - Update a practitioner (expects { practitioner_id, ...fields })
export async function PATCH(req: Request) {
  let body: any;
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

  const { practitioner_id, ...fields } = body;
  if (!practitioner_id) {
    const res = makeRes({ tenant, message: 'Missing practitioner_id', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }

  const { data: existingRow, error: existingError } = await supabase
    .from('practitioners')
    .select('data')
    .eq('practitioner_id', practitioner_id)
    .single();

  if (existingError) {
    const res = makeRes({ tenant, message: existingError.message, severity: 'error' });
    return NextResponse.json(res, { status: 404 });
  }

  const title = typeof fields?.title === 'string' ? fields.title.trim() || null : undefined;
  const nextData = fields.data === undefined ? existingRow?.data ?? null : fields.data;

  const { data, error } = await supabase
    .from('practitioners')
    .update({
      ...fields,
      ...(title !== undefined ? { title } : {}),
      data: nextData,
    })
    .eq('practitioner_id', practitioner_id)
    .select();
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
  const res = makeRes({ tenant, message: 'Practitioner updated', severity: 'success', data });
  return NextResponse.json(res);
}