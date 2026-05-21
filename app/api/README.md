# Askleida API (Next.js + Supabase)

This directory implements a secure, RESTful API for managing your Supabase database using Next.js API routes. All endpoints are designed for server-side use and require Supabase authentication. Security is a priority—never expose your Supabase service role key to the client.

## Overview

- **Framework:** Next.js API routes
- **Database:** Supabase (Postgres)
- **Auth:** All requests require Supabase Auth; endpoints use the service role key and must only be called server-side.
- **Response Pattern:** All endpoints use the `makeRes` utility for consistent, metadata-rich responses.

## Route Structure

### `/api/`
- **GET**: Health check endpoint. Returns a simple success message.

### `/api/supabase/`
- **GET**: List all tables in the database (via the `list_tables` Postgres function).

### `/api/supabase/tables/`
- **GET**: List all tables in the database.
- **POST**: Create a new table. Requires a SQL statement in the request body:
  ```json
  { "sql": "CREATE TABLE ..." }
  ```

### `/api/supabase/tables/[table]`
- **GET**: List all rows in the specified table.
- **POST**: Insert a new row. Request body should be a JSON object representing the row.
- **PATCH**: Update rows. Request body should include:
  ```json
  { "filter": { ... }, "values": { ... } }
  ```
- **DELETE**: Delete rows. Request body should include:
  ```json
  { "filter": { ... } }
  ```

### `/api/supabase/tables/[table]/schema`
- **GET**: Get the schema (columns) for the specified table.
- **PATCH**: Alter the table structure. Requires a SQL statement in the request body:
  ```json
  { "sql": "ALTER TABLE ..." }
  ```

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
- `lib/` — Shared utilities (e.g., `makeRes` for response formatting)
- `supabase/` — All Supabase-related API routes
  - `route.ts` — List tables
  - `tables/` — Table CRUD and schema management
    - `[table]/route.ts` — CRUD for individual tables
    - `[table]/schema/route.ts` — Schema management for individual tables

