
## Product

Welcome, you are logged in as a Product

has an uuid (Universal Unique Identifier)

- Can manage their products
- Can Manage their tips


Product data is stored in a JSONB object saved to the products table

The table be like...


```sql
create table public.products (
  product_id uuid not null default gen_random_uuid (),
  practitioner_id uuid null default gen_random_uuid (),
  title text null,
  created timestamp with time zone not null default now(),
  updated timestamp with time zone null default now(),
  data jsonb null,
  constraint products_pkey primary key (product_id),
  constraint products_practitioner_id_fkey foreign KEY (practitioner_id) references practitioners (practitioner_id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;
```

Objects should be like

```typescript
export type T_Product = {
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



[text](../../../../public/askleida/csv/products_rows.csv)