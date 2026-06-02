
## Client

Welcome, you are logged in as a Client

has an uuid (Universal Unique Identifier)

- Can manage their clients
- Can Manage their tips


Client data is stored in a JSONB object saved to the clients table

The table be like...


```sql
create table public.clients (
  client_id uuid not null default gen_random_uuid (),
  practitioner_id uuid null default gen_random_uuid (),
  title text null,
  created timestamp with time zone not null default now(),
  updated timestamp with time zone null default now(),
  data jsonb null,
  constraint clients_pkey primary key (client_id),
  constraint clients_practitioner_id_fkey foreign KEY (practitioner_id) references practitioners (practitioner_id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;
```

Objects should be like

```typescript
export type T_Client = {
	id?: string;
	practitioner_id?: string | null;
	first_name?: string | null;
	last_name?: string | null;
	date_of_birth?: string | null;
	email?: string | null;
	skin_type?: string | null;
	concern_tags?: string[] | string | null;
	is_pregnant?: boolean | 'true' | 'false' | null;
	is_breastfeeding?: boolean | 'true' | 'false' | null;
	current_medication?: string | null;
	skin_overview?: string | null;
	personal_notes?: string | null;
	created_at?: string | null;
	[key: string]: unknown;
};

```



[text](../../../../public/askleida/csv/clients_rows.csv)