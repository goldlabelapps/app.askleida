export type T_RecommendationData = {
	client_id?: string | null;
	client_name?: string | null;
	therapist_context?: string | null;
	tips?: string | null;
	draft?: string | null;
	export_url?: string | null;
	[key: string]: unknown;
};

export type T_Recommendation = {
	recommendation_id?: string;
	practitioner_id?: string | null;
	title?: string | null;
	created?: string | null;
	updated?: string | null;
	created_at?: string | null;
	data?: T_RecommendationData | null;
	[key: string]: unknown;
};

