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

-- migration from old columns to data jsonb
update public.clients
set data = jsonb_strip_nulls(
  coalesce(data, '{}'::jsonb)
  || jsonb_build_object(
    'first_name', first_name,
    'last_name', last_name,
    'date_of_birth', date_of_birth,
    'email', lower(email)
  )
);

alter table public.clients
  drop column if exists first_name,
  drop column if exists last_name,
  drop column if exists date_of_birth,
  drop column if exists email;
```
