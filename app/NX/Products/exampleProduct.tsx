export type T_Product = {
  title: string; // required, min 5 chars
  slug?: string;
  created_at?: string;
  description?: string | null;
  brand?: string | null;
  routine_step?: string | null;
  treat_sublabel?: string | null;
  distribution_type?: string | null;
  website_url?: string | null;
  claude_description?: string | null;
  how_to_apply?: string | null;
  active_ingredients?: string | null;
  contraindications?: string | null;
  is_pregnancy_safe?: boolean | null;
  is_breastfeeding_safe?: boolean | null;
  skin_type_tags?: string[] | null;
  concern_tags?: string[] | null;
  image_url?: string | null;
  is_verified?: boolean | null;
  is_seeded?: boolean | null;
  price?: number | null;
};

export const exampleProduct: T_Product = {
  "title": "X3M Pure Pore Minimizer Mask",
  "slug": "x3m-pure-pore-minimizer-mask",
  "created_at": "2026-05-23T09:07:16.132078+00:00",
  "description": "An active carbon sheet mask that deep cleanses and minimises the appearance of pores.",
  "brand": "CLINICCARE",
  "routine_step": null,
  "treat_sublabel": "",
  "distribution_type": "professional_web",
  "website_url": "https://www.4tmedical.com/product/skincare/cliniccare-home-skincare/cliniccare-x3m-pure-pore-minimizer-masks/",
  "claude_description": "An active carbon sheet mask that deep cleanses and minimises the appearance of pores. Uses activated charcoal to draw out impurities and excess sebum while Glycerin maintains moisture balance.",
  "how_to_apply": "Apply to clean skin. Leave on for 10-15 minutes. Remove and gently pat remaining serum into skin. Use once a week. Do not use after professional treatments that sensitise the skin.",
  "active_ingredients": "Activated Charcoal, Low Molecular Weight Hyaluronic Acid (6mg/ml), Sodium PCA, L-Arginine",
  "contraindications": "Do not use after CLINICCARE peels, microneedling, dermaplaning or any treatment that sensitises the skin. Not suitable for very sensitive or reactive skin.",
  "is_pregnancy_safe": true,
  "is_breastfeeding_safe": true,
  "skin_type_tags": [
    "Oily",
    "Combination"
  ],
  "concern_tags": [
    "acne",
    "barrier damage"
  ],
  "image_url": "https://www.4tmedical.com/wp-content/uploads/2025/04/Untitled-design-30.jpg",
  "is_verified": true,
  "is_seeded": true,
  "price": 12.49
}

/*
INSERT INTO "public"."master_products" ("id", "product_name", "brand", "routine_step", "treat_sublabel", "distribution_type", "website_url", "claude_description", "how_to_apply", "active_ingredients", "contraindications", "is_pregnancy_safe", "is_breastfeeding_safe", "skin_type_tags", "concern_tags", "image_url", "is_verified", "is_seeded", "created_at") VALUES ('00123f3a-2e00-4e1f-931f-1be92869e191', 'X3M Pure Pore Minimizer Mask', 'CLINICCARE', 'Treat', null, 'professional_web', 'https://www.4tmedical.com/product/skincare/cliniccare-home-skincare/cliniccare-x3m-pure-pore-minimizer-masks/', 'An active carbon sheet mask that deep cleanses and minimises the appearance of pores. Uses activated charcoal to draw out impurities and excess sebum while Glycerin maintains moisture balance.', 'Apply to clean skin. Leave on for 10-15 minutes. Remove and gently pat remaining serum into skin. Use once a week. Do not use after professional treatments that sensitise the skin.', 'Activated Charcoal, Low Molecular Weight Hyaluronic Acid (6mg/ml), Sodium PCA, L-Arginine', 'Do not use after CLINICCARE peels, microneedling, dermaplaning or any treatment that sensitises the skin. Not suitable for very sensitive or reactive skin.', true, true, ARRAY['Oily','Combination'], ARRAY['acne','barrier damage'], 'https://www.4tmedical.com/wp-content/uploads/2025/04/Untitled-design-30.jpg', true, true, '2026-03-25 17:00:46.747429+00'), ('0472d1b2-e7f7-4457-ba23-973f81c83731', 'Mineral 89', 'Vichy', 'spf', null, 'retail', nu
*/