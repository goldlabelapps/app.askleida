import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../../../lib/makeRes';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper to get table name from params
function getTableName(params: { table: string }) {
  return params.table;
}

// GET: List all rows in a table
export async function GET(req: Request, { params }: { params: { table: string } }) {
  const table = getTableName(params);
  const { data, error } = await supabase.from(table).select('*');
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
  const res = makeRes({ tenant, message: `Fetched rows from ${table}`, severity: 'success', data });
  return NextResponse.json(res);
}

// POST: Insert a new row
export async function POST(req: Request, { params }: { params: { table: string } }) {
  const table = getTableName(params);
  const body = await req.json();
  const { data, error } = await supabase.from(table).insert([body]).select();
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
  const res = makeRes({ tenant, message: `Inserted row into ${table}`, severity: 'success', data });
  return NextResponse.json(res);
}

// PATCH: Update rows (expects { filter, values })
export async function PATCH(req: Request, { params }: { params: { table: string } }) {
  const table = getTableName(params);
  const { filter, values } = await req.json();
  if (!filter || !values) {
    const res = makeRes({ tenant, message: 'Missing filter or values', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }
  const { data, error } = await supabase.from(table).update(values).match(filter).select();
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
  const res = makeRes({ tenant, message: `Updated rows in ${table}`, severity: 'success', data });
  return NextResponse.json(res);
}

// DELETE: Delete rows (expects { filter })
export async function DELETE(req: Request, { params }: { params: { table: string } }) {
  const table = getTableName(params);
  const { filter } = await req.json();
  if (!filter) {
    const res = makeRes({ tenant, message: 'Missing filter', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }
  const { data, error } = await supabase.from(table).delete().match(filter).select();
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
  const res = makeRes({ tenant, message: `Deleted rows from ${table}`, severity: 'success', data });
  return NextResponse.json(res);
}
