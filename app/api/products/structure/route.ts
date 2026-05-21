
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../../lib/makeRes';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET /api/products/structure - Returns the structure of the products table
export async function GET() {
  // Use the get_table_schema RPC
  const { data, error } = await supabase.rpc('get_table_schema', { table_name: 'products' });

  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }

  // Transform to a TypeScript-like object structure
  const tsFields = data?.map((col: any) => ({
    name: col.column_name,
    type: col.data_type,
    optional: col.is_nullable === 'YES',
    default: col.column_default,
    maxLength: col.character_maximum_length,
    numericPrecision: col.numeric_precision,
    numericScale: col.numeric_scale,
  }));

  const res = makeRes({
    tenant,
    message: 'Fetched products table structure',
    severity: 'success',
    data: tsFields,
  });
  return NextResponse.json(res);
}
