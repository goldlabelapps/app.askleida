import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// POST /api/products - Create a new product
export async function POST(req: Request) {
  const body = await req.json();
  if (!body.name || !body.price) {
    const res = makeRes({ tenant, message: 'Missing required fields: name, price', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }
  const { data, error } = await supabase.from('products').insert([body]).select();
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
  const res = makeRes({ tenant, message: 'Product created', severity: 'success', data });
  return NextResponse.json(res);
}
