import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// PATCH /api/accounts - Update an account (expects { user_id, ...fields })
export async function PATCH(req: Request) {
  const body = await req.json();
  const { user_id, ...fields } = body;
  if (!user_id) {
    const res = makeRes({ tenant, message: 'Missing user_id', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }
  const { data, error } = await supabase.from('accounts').update(fields).eq('user_id', user_id).select();
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
  const res = makeRes({ tenant, message: 'Account updated', severity: 'success', data });
  return NextResponse.json(res);
}
