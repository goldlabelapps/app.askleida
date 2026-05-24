
export interface I_Product {
    product_id: number;
    created_at: string; // ISO timestamp
    name?: string | null;
    title?: string | null;
    description?: string | null;
    id?: number | null;
    product_name?: string | null;
    brand?: string | null;
    routine_step?: number | null;
    treat_sublabel?: string | null;
    distribution_type?: string | null;
    website_url?: string | null;
    claude_description?: string | null;
    how_to_apply?: string | null;
    active_ingredients?: string | null;
    contraindications?: string | null;
    is_pregnancy_safe?: boolean | null;
    is_breastfeeding_safe?: boolean | null;
    skin_type_tags?: any | null; // JSONB, consider a more specific type if known
    concern_tags?: any | null;   // JSONB, consider a more specific type if known
    image_url?: string | null;
    is_verified?: boolean | null;
    is_seeded?: boolean | null;
    price?: number | null;
    slug?: string | null;
}


