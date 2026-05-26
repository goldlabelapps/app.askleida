![askleida.com](public/askleida/png/banner/trans.png) 

## askleida.com

- [askleida.com on Vercel](https://askleida.com)
- [Supabase](https://supabase.com/dashboard/project/fnogxpcfvphmdpxeflqa)
- Powered by [NX°](https://goldlabel.pro/nx)

## Askleida API (Next.js + Supabase)

This directory implements a secure, RESTful API for managing your Supabase database using Next.js API routes. All endpoints are designed for server-side use and require Supabase authentication. Security is a priority—never expose your Supabase service role key to the client.

## Overview

- **Framework:** Next.js API routes
- **Database:** Supabase (Postgres)
- **Auth:** All requests require Supabase Auth; endpoints use the service role key and must only be called server-side.
- **Response Pattern:** All endpoints use the `makeRes` utility for consistent, metadata-rich responses.

## Route Structure

### `/api/`
- **GET**: Health check endpoint. Returns a simple success message.

## Requirements
- The following Postgres functions must exist in your Supabase database:
  - `list_tables()`
  - `execute_sql(sql text)`
  - `get_table_schema(table_name text)`
- All endpoints use the `makeRes` pattern for consistent API responses.
- Only use these endpoints server-side. Never expose your service role key to the client.

## Security Notes
- All endpoints require authentication via Supabase Auth.
- The Supabase service role key is used server-side only.
- Never expose sensitive keys or credentials to the client.

## File Structure
- `route.ts` — Root API health check
- `lib/` — Shared utilities (e.g., `makeRes` for re

Copyright © 2026 askleida.com - All Rights Reserved
