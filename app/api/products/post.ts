import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../';

export type T_Product = {
  title: string;
  slug: string;
  name?: string | null;
  created_at?: string; // ISO timestamp
  description?: string | null;
  id?: number | null;
  product_name?: string | null;
  brand?: string | null;
  routine_step?: number | null;
  treat_sublabel?: string | null;
  distribution_type?: string | null;
  website_url?: string | null;
  claude_description?: string | null;
  how_to_apply?: string | null;
  active_ingredients?: string | null;
  contraindications?: string | null;
  is_pregnancy_safe?: boolean | null;
  is_breastfeeding_safe?: boolean | null;
  skin_type_tags?: any | null; // JSONB, consider a more specific type if known
  concern_tags?: any | null;   // JSONB, consider a more specific type if known
  image_url?: string | null;
  is_verified?: boolean | null;
  is_seeded?: boolean | null;
  price?: number | null;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// POST /api/products - Create a new product
export async function POST(req: Request) {

  let body: T_Product;
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
  body.title = body.title?.trim();
  body.slug = body.slug?.trim().toLowerCase();

  const errors: { field: string; message: string }[] = [];

  // Required fields
  if (!body.title || typeof body.title !== 'string' || body.title.length < 3) {
    errors.push({ field: 'title', message: 'Title is required and must be a string of at least 3 characters.' });
  }
  if (!body.slug || typeof body.slug !== 'string' || !/^[a-z0-9-]+$/.test(body.slug)) {
    errors.push({ field: 'slug', message: 'Slug is required, must be a string, and only contain lowercase letters, numbers, and dashes.' });
  }
  if (body.price !== undefined && (typeof body.price !== 'number' || body.price < 0)) {
    errors.push({ field: 'price', message: 'Price must be a positive number.' });
  }
  // Add more field validations as needed...

  if (errors.length > 0) {
    const res = makeRes({ tenant, message: 'Validation failed', severity: 'error', data: { errors } });
    return NextResponse.json(res, { status: 400 });
  }

  // Check for duplicate slug
  const { data: existing, error: dupError } = await supabase
    .from('products')
    .select('slug')
    .eq('slug', body.slug)
    .maybeSingle();

  if (dupError) {
    const res = makeRes({ tenant, message: dupError.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
  if (existing) {
    const res = makeRes({ tenant, message: 'A product with this slug already exists.', severity: 'error' });
    return NextResponse.json(res, { status: 409 });
  }

  // Insert product
  const { data, error } = await supabase.from('products').insert([body]).select();
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }

  const res = makeRes({ tenant, message: 'Product created', severity: 'success', data });
  return NextResponse.json(res);
}
