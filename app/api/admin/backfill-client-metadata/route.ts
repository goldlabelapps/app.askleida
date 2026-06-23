import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../lib/makeRes';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * POST /api/admin/backfill-client-metadata
 * 
 * One-time backfill: For each client record with an email,
 * find the corresponding auth user and update their user_metadata.client_id
 * if it's missing or doesn't match.
 * 
 * Requires NOTIFY_SECRET header for auth (reusing existing secret pattern).
 */
export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const secret = process.env.NOTIFY_SECRET;
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!secret || token !== secret) {
    return NextResponse.json(
      makeRes({ tenant, severity: 'error', message: 'Unauthorized' }),
      { status: 401 },
    );
  }

  try {
    // Fetch all clients
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('client_id, data');

    if (clientsError) {
      throw new Error(`Failed to fetch clients: ${clientsError.message}`);
    }

    if (!Array.isArray(clients) || clients.length === 0) {
      return NextResponse.json(
        makeRes({
          tenant,
          severity: 'success',
          message: 'No clients found',
          data: { updated: 0, skipped: 0 },
        }),
      );
    }

    let updated = 0;
    let skipped = 0;
    const results: { client_id: string; email: string; status: string; message?: string }[] = [];

    for (const client of clients) {
      const clientId = client?.client_id;
      const clientData = client?.data && typeof client.data === 'object' && !Array.isArray(client.data)
        ? client.data
        : {};
      const email = typeof clientData.email === 'string' ? clientData.email.trim().toLowerCase() : '';

      if (!clientId || !email) {
        skipped++;
        results.push({
          client_id: clientId || 'unknown',
          email: email || 'missing',
          status: 'skipped',
          message: 'Missing client_id or email',
        });
        continue;
      }

      try {
        // Fetch auth user by email
        const { data: authData, error: authError } = await supabase.auth.admin.getUserByEmail(email);

        if (authError) {
          skipped++;
          results.push({
            client_id: clientId,
            email,
            status: 'skipped',
            message: `Auth user not found: ${authError.message}`,
          });
          continue;
        }

        const authUser = authData?.user;
        if (!authUser) {
          skipped++;
          results.push({
            client_id: clientId,
            email,
            status: 'skipped',
            message: 'Auth user is null',
          });
          continue;
        }

        // Check if client_id already in metadata
        const existingClientId = authUser.user_metadata?.client_id;
        if (existingClientId === clientId) {
          skipped++;
          results.push({
            client_id: clientId,
            email,
            status: 'skipped',
            message: 'client_id already correct in metadata',
          });
          continue;
        }

        // Update metadata
        const { error: updateError } = await supabase.auth.admin.updateUserById(authUser.id, {
          user_metadata: {
            ...authUser.user_metadata,
            client_id: clientId,
          },
        });

        if (updateError) {
          skipped++;
          results.push({
            client_id: clientId,
            email,
            status: 'failed',
            message: updateError.message,
          });
        } else {
          updated++;
          results.push({
            client_id: clientId,
            email,
            status: 'updated',
          });
        }
      } catch (e: unknown) {
        skipped++;
        results.push({
          client_id: clientId,
          email,
          status: 'error',
          message: e instanceof Error ? e.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json(
      makeRes({
        tenant,
        severity: 'success',
        message: `Backfill complete: ${updated} updated, ${skipped} skipped`,
        data: { updated, skipped, results },
      }),
    );
  } catch (e: unknown) {
    console.error('[backfill-client-metadata] error:', e);
    return NextResponse.json(
      makeRes({
        tenant,
        severity: 'error',
        message: e instanceof Error ? e.message : 'Backfill failed',
      }),
      { status: 500 },
    );
  }
}
