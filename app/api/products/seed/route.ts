export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import path from 'path';
import Papa from 'papaparse';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../../';

const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper to normalize CSV row to DB schema
function normalizeProduct(csvRow: any): any {
  // Remove fields not in DB schema and map/rename as needed
  return {
    // id is omitted (auto-generated)
    title: csvRow.product_name || csvRow.title || '',
    slug: (csvRow.product_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: csvRow.claude_description || csvRow.description || '',
    brand: csvRow.brand || '',
    routine_step: isNaN(Number(csvRow.routine_step)) ? null : Number(csvRow.routine_step),
    treat_sublabel: csvRow.treat_sublabel || '',
    distribution_type: csvRow.distribution_type || '',
    website_url: csvRow.website_url || '',
    claude_description: csvRow.claude_description || '',
    how_to_apply: csvRow.how_to_apply || '',
    active_ingredients: csvRow.active_ingredients || '',
    contraindications: csvRow.contraindications || '',
    is_pregnancy_safe: csvRow.is_pregnancy_safe === 'true',
    is_breastfeeding_safe: csvRow.is_breastfeeding_safe === 'true',
    skin_type_tags: csvRow.skin_type_tags ? JSON.parse(csvRow.skin_type_tags) : [],
    concern_tags: csvRow.concern_tags ? JSON.parse(csvRow.concern_tags) : [],
    image_url: csvRow.image_url || '',
    is_verified: csvRow.is_verified === 'true',
    is_seeded: csvRow.is_seeded === 'true',
    price: csvRow.price ? Number(csvRow.price) : null,
    // created_at is omitted (auto-generated)
  };
}

// GET /api/products/seed - Seed endpoint
export async function GET() {
  const csvPath = path.join(process.cwd(), 'app', 'api', 'products', 'data', 'example.csv');
  let firstRowObj = null;
  let message = '🌱 Products API seed endpoint is ready!';
  let severity = 'success';
  let insertResult = null;
  try {
    // Truncate the products table before seeding
    const { error: truncateError } = await supabase.rpc('truncate_table', { table_name: 'products' });
    if (truncateError) {
      message = 'Failed to truncate products table: ' + truncateError.message;
      severity = 'error';
    } else {
      const csv = fs.readFileSync(csvPath, 'utf-8');
      const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
      if (parsed.data && parsed.data.length > 0) {
        // Normalize all products
        const normalizedProducts = parsed.data.map(normalizeProduct);
        // Insert all products into Supabase
        const { data, error } = await supabase.from('products').insert(normalizedProducts).select();
        if (error) {
          message = 'Insert failed: ' + error.message;
          severity = 'error';
        } else {
          message = `${normalizedProducts.length} products inserted into Supabase!`;
          insertResult = data;
        }
      } else {
        message = 'CSV file is empty or malformed.';
        severity = 'error';
      }
    }
  } catch (e) {
    message = 'Failed to read/insert CSV: ' + (e instanceof Error ? e.message : String(e));
    severity = 'error';
  }
  const res = makeRes({
    tenant,
    message,
    severity: severity as 'success' | 'error' | 'warning' | 'info',
    data: {},
  });

  return NextResponse.json(res);
}
