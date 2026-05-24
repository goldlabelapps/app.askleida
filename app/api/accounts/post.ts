import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../';

export type T_Account = {
  user_id: string;
  email: string;
  name?: string | null;
  created_at?: string;
  avatar?: string | null;
  level?: number | null;
  updated_at?: string | null;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// POST /api/accounts - Create a new account
export async function POST(req: Request) {
  let body: T_Account;
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

  // Sanitize and normalize
  body.email = body.email?.trim().toLowerCase();
  body.name = body.name?.trim();

  const errors: { field: string; message: string }[] = [];
  if (!body.user_id) errors.push({ field: 'user_id', message: 'user_id is required' });
  if (!body.email) errors.push({ field: 'email', message: 'email is required' });
  if (errors.length) {
    const res = makeRes({ tenant, message: 'Validation error', severity: 'error', data: errors });
    return NextResponse.json(res, { status: 400 });
  }

  const { data, error } = await supabase.from('accounts').insert([body]).select();
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
  const res = makeRes({ tenant, message: 'Account created', severity: 'success', data });
  return NextResponse.json(res);
}
