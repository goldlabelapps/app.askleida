import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET /api/products - List all products
export async function GET(req: Request) {
  const url = req?.url ? new URL(req.url) : null;
  const id = url?.searchParams.get('id');
  const search = url?.searchParams.get('s') || '';
  const page = parseInt(url?.searchParams.get('page') || '1', 10);
  const limit = parseInt(url?.searchParams.get('limit') || '10', 10);
  const offset = (page - 1) * limit;

  if (id) {
    // Get product(s) by id (may return multiple, handle as array)
    const { data, error } = await supabase.from('products').select('*').eq('product_id', id);
    if (error) {
      const res = makeRes({ tenant, message: error.message, severity: 'error' });
      return NextResponse.json(res, { status: 404 });
    }
    if (!data || data.length === 0) {
      const res = makeRes({ tenant, message: 'No product found with this id', severity: 'error' });
      return NextResponse.json(res, { status: 404 });
    }
    const res = makeRes({ tenant, message: 'Fetched product(s)', severity: 'success', data });
    return NextResponse.json(res);
  }

  // Build query for search and pagination
  let query = supabase.from('products').select('*', { count: 'exact' });
  if (search) {
    // Search in title OR description (case-insensitive)
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }

  // Pagination metadata
  const total = count || 0;
  const total_pages = Math.ceil(total / limit);
  const pagination = { total, total_pages, page, limit };

  // Pass pagination and search as part of meta (not root)
  const res = makeRes({
    tenant,
    message: 'Fetched products',
    severity: 'success',
    data,
    meta: { pagination, search },
  });
  return NextResponse.json(res);
}
