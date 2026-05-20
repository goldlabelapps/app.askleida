# Supabase API Routes

This folder contains API endpoints for full CRUD and schema management of your Supabase database.

## Route Structure

### 1. `/api/supabase/tables`
- **GET**: List all tables in the database.
- **POST**: Create a new table. Requires a SQL statement in the request body:
  ```json
  { "sql": "CREATE TABLE ..." }
  ```

### 2. `/api/supabase/tables/[table]`
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

### 3. `/api/supabase/tables/[table]/schema`
- **GET**: Get the schema (columns) for the specified table.
- **PATCH**: Alter the table structure. Requires a SQL statement in the request body:
  ```json
  { "sql": "ALTER TABLE ..." }
  ```

## Requirements
- These endpoints require the following Postgres functions in your Supabase database:
  - `list_tables()`
  - `execute_sql(sql text)`
  - `get_table_schema(table_name text)`
- All endpoints use the `makeRes` pattern for consistent API responses.
- Only use these endpoints server-side. Never expose your service role key to the client.

## Security
- Protect these endpoints with authentication/authorization as needed.
- Schema changes are powerful—restrict access appropriately.

---

_This API is intended for advanced database management and automation. Use with care!_
