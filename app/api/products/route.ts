
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../lib/makeRes';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET /api/products - List all products
export async function GET(req: Request) {
  const url = req?.url ? new URL(req.url) : null;
  const id = url?.searchParams.get('id');
  if (id) {
    // Get single product by id
    const { data, error } = await supabase.from('products').select('*').eq('product_id', id).single();
    if (error) {
      const res = makeRes({ tenant, message: error.message, severity: 'error' });
      return NextResponse.json(res, { status: 404 });
    }
    const res = makeRes({ tenant, message: 'Fetched product', severity: 'success', data });
    return NextResponse.json(res);
  }
  // List all products
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
  const res = makeRes({ tenant, message: 'Fetched products', severity: 'success', data });
  return NextResponse.json(res);
}

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

// PATCH /api/products - Update a product (expects { product_id, ...fields })
export async function PATCH(req: Request) {
  const body = await req.json();
  const { product_id, ...fields } = body;
  if (!product_id) {
    const res = makeRes({ tenant, message: 'Missing product_id', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }
  const { data, error } = await supabase.from('products').update(fields).eq('product_id', product_id).select();
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
  const res = makeRes({ tenant, message: 'Product updated', severity: 'success', data });
  return NextResponse.json(res);
}

// DELETE /api/products - Delete a product (expects { product_id })
export async function DELETE(req: Request) {
  const { product_id } = await req.json();
  if (!product_id) {
    const res = makeRes({ tenant, message: 'Missing product_id', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }
  const { data, error } = await supabase.from('products').delete().eq('product_id', product_id).select();
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
  const res = makeRes({ tenant, message: 'Product deleted', severity: 'success', data });
  return NextResponse.json(res);
}
