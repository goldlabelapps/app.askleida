import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../../lib/makeRes';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET: List all tables
export async function GET() {
  const { data, error } = await supabase.rpc('list_tables');
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
  const res = makeRes({ tenant, message: 'Fetched tables', severity: 'success', data });
  return NextResponse.json(res);
}

// POST: Create a new table (requires SQL statement in body)
export async function POST(req: Request) {
  try {
    const { sql } = await req.json();
    if (!sql) throw new Error('SQL statement required');
    const { error } = await supabase.rpc('execute_sql', { sql });
    if (error) throw error;
    const res = makeRes({ tenant, message: 'Table created', severity: 'success' });
    return NextResponse.json(res);
  } catch (error: any) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
}
