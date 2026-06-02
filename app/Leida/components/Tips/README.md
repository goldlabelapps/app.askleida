## Tips

Tips are practitioner-owned records stored in the tips table.

- Can list tips
- Can create a new tip
- Can view a single tip

Tips data is stored in a JSONB object saved to the tips table.

```sql
create table public.tips (
	tip_id uuid not null default gen_random_uuid (),
	practitioner_id uuid null default gen_random_uuid (),
	title text null,
	created timestamp with time zone not null default now(),
	updated timestamp with time zone null default now(),
	data jsonb null,
	constraint tips_pkey primary key (tip_id),
	constraint tips_practitioner_id_fkey foreign KEY (practitioner_id) references practitioners (practitioner_id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;
```

Tip objects follow this shape:

```typescript
export type T_Tip = {
	tip_id?: string;
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
