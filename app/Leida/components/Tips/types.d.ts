export type T_TipData = {
	bullets?: string[] | null;
	category?: string | null;
	is_active?: string | boolean | null;
	is_custom?: string | boolean | null;
	display_order?: string | number | null;
	practitioner_id?: string | null;
	[key: string]: unknown;
};

export type T_Tip = {
	tip_id?: string;
	practitioner_id?: string | null;
	title?: string | null;
	created?: string | null;
	updated?: string | null;
	data?: T_TipData | null;
	[key: string]: unknown;
};
