import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../../../../lib/makeRes';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET: Get table schema
export async function GET(req: Request, { params }: { params: { table: string } }) {
  const table = params.table;
  // Query information_schema.columns for schema
  const { data, error } = await supabase.rpc('get_table_schema', { table_name: table });
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
  const res = makeRes({ tenant, message: `Fetched schema for ${table}`, severity: 'success', data });
  return NextResponse.json(res);
}

// PATCH: Alter table structure (expects { sql })
export async function PATCH(req: Request, { params }: { params: { table: string } }) {
  const table = params.table;
  const { sql } = await req.json();
  if (!sql) {
    const res = makeRes({ tenant, message: 'SQL statement required', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }
  const { error } = await supabase.rpc('execute_sql', { sql });
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
  const res = makeRes({ tenant, message: `Altered schema for ${table}`, severity: 'success' });
  return NextResponse.json(res);
}
