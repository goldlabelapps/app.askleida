export type T_Client = {
	client_id?: string;
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
