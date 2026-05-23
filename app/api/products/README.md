# Product Data & API

This folder contains:
- Example product data (`example.csv`)
- API route handlers for product CRUD operations

## Product Data Structure (`example.csv`)
Each row represents a skincare product with the following fields:

| Column                | Description                                                                                 |
|-----------------------|---------------------------------------------------------------------------------------------|
| id                    | Unique product identifier (UUID)                                                            |
| product_name          | Name of the product                                                                         |
| brand                 | Brand/manufacturer                                                                          |
| routine_step          | Skincare routine step (e.g., Cleanse, Treat, Moisturise, SPF)                               |
| treat_sublabel        | Subcategory for treatments (if any)                                                          |
| distribution_type     | `retail` or `professional_web` (distribution channel)                                        |
| website_url           | Product or brand website URL                                                                |
| claude_description    | Short product description                                                                   |
| how_to_apply          | Application instructions                                                                    |
| active_ingredients    | Key active ingredients (comma-separated)                                                    |
| contraindications     | Warnings, incompatibilities, or usage restrictions                                          |
| is_pregnancy_safe     | `true`/`false` if safe for pregnancy                                                        |
| is_breastfeeding_safe | `true`/`false` if safe for breastfeeding                                                    |
| skin_type_tags        | JSON array of suitable skin types (e.g., ["dry", "oily"])                                 |
| concern_tags          | JSON array of targeted skin concerns (e.g., ["acne", "ageing"])                          |
| image_url             | Product image URL                                                                           |
| is_verified           | `true`/`false` if product is verified                                                       |
| is_seeded             | `true`/`false` if product is a seed/example                                                 |
| created_at            | Timestamp of creation                                                                       |

## Common Categories
- **Routine Steps**: Cleanse, Treat, Moisturise, SPF
- **Skin Types**: dry, oily, combination, normal, sensitive
- **Concerns**: acne, barrier damage, dehydration, ageing, pigmentation, redness
- **Distribution**: retail, professional_web

## API Endpoints
- `GET /api/products` — List all products or fetch by `id`
- `POST /api/products` — Create a new product (JSON body)
- `PATCH /api/products` — Update a product (by `product_id`)
- `DELETE /api/products` — Delete a product (by `product_id`)

## Notes
- Some fields may be empty for certain products.
- Use the tags and categories for filtering and UI/UX enhancements.
- See the CSV for real data examples.
