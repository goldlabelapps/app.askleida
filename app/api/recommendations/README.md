```sql
create table public.recommendations (
  recommendation_id uuid not null default gen_random_uuid (),
  practitioner_id uuid null default gen_random_uuid (),
  title text null,
  created timestamp with time zone not null default now(),
  updated timestamp with time zone null default now(),
  data jsonb null,
  constraint recommendations_pkey primary key (recommendation_id),
  constraint recommendations_practitioner_id_fkey foreign KEY (practitioner_id) references practitioners (practitioner_id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;
```

The recommendation record stores client-facing output and any supporting metadata inside `data`.

Recommended `data` fields:

1. `client_id`
2. `client_name`
3. `therapist_context`
4. `tips`
5. `draft`
6. `export_url`
