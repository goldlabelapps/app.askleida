export type T_ProductData = {
	name?: string | null;
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
	name?: string | null;
	category?: string | null;
	sku?: string | null;
	price?: number | null;
	description?: string | null;
	notes?: string | null;
	created?: string | null;
	updated?: string | null;
	created_at?: string | null;
	data?: T_ProductData | null;
	[key: string]: unknown;
};
