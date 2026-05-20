import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../../../../lib/makeRes';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);


// Helper to get table name from the URL
function getTableNameFromUrl(req: Request) {
  const url = new URL(req.url);
  // /api/supabase/tables/[table]/schema
  const parts = url.pathname.split('/');
  // Find the table name as the second-to-last segment
  return parts[parts.length - 2];
}

// GET: Get table schema
export async function GET(req: Request) {
  const table = getTableNameFromUrl(req);
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
export async function PATCH(req: Request) {
  const table = getTableNameFromUrl(req);
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
