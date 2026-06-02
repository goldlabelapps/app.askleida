import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../';

export type T_Practitioner = {
  practitioner_id?: string;
  title?: string | null;
  created?: string;
  updated?: string | null;
  data?: unknown;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// POST /api/practitioner - Create a new practitioner
export async function POST(req: Request) {
  let body: T_Practitioner;
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

  body.title = body.title?.trim() || null;

  const payload: T_Practitioner = {
    practitioner_id: body.practitioner_id,
    title: body.title,
    data: body.data === undefined ? null : body.data,
    created: body.created,
    updated: body.updated,
  };

  const { data, error } = await supabase.from('practitioners').insert([payload]).select();
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
  const res = makeRes({ tenant, message: 'Practitioner created', severity: 'success', data });
  return NextResponse.json(res);
}