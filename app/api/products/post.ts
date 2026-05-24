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
  const body: T_Product = await req.json();
  const errors: { field: string; message: string }[] = [];


  // Required fields and type checks
  if (!body.title || typeof body.title !== 'string') {
    errors.push({ field: 'title', message: 'Title is required and must be a string.' });
  }
  if (!body.slug || typeof body.slug !== 'string') {
    errors.push({ field: 'slug', message: 'Slug is required and must be a string.' });
  }

  if (errors.length > 0) {
    const res = makeRes({ tenant, message: 'Validation failed', severity: 'error', data: { errors } });
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
