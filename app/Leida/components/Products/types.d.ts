export type T_ProductData = {
	name?: string | null;
	brand?: string | null;
	image_url?: string | null;
	is_seeded?: boolean | null;
	is_verified?: boolean | null;
	website_url?: string | null;
	concern_tags?: string[] | null;
	how_to_apply?: string | null;
	routine_step?: string | null;
	skin_type_tags?: string[] | null;
	distribution_type?: string | null;
	is_pregnancy_safe?: boolean | null;
	is_breastfeeding_safe?: boolean | null;

	// Legacy fields kept for compatibility with older product flows.
	category?: string | null;
	sku?: string | null;
	price?: number | null;
	description?: string | null;
	notes?: string | null;
	[key: string]: unknown;
};

export type T_Product = {
	product_id?: string;
	practitioner_id?: string | null;
	title?: string | null;
	created?: string | null;
	updated?: string | null;

	// Legacy top-level fields kept for compatibility with existing forms/actions.
	name?: string | null;
	category?: string | null;
	sku?: string | null;
	price?: number | null;
	description?: string | null;
	notes?: string | null;
	created_at?: string | null;
	data?: T_ProductData | null;
	[key: string]: unknown;
};
