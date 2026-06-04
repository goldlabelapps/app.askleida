## Recommendations

Recommendations now follows the same CRUD pattern as Clients and Products.

### Record shape

1. `recommendation_id`
2. `practitioner_id`
3. `title`
4. `created`
5. `updated`
6. `data`

### Recommended `data` fields

1. `client_id`
2. `client_name`
3. `therapist_context`
4. `tips`
5. `draft`
6. `export_url`

### Routes

1. `/recommendations`
2. `/recommendations/new`
3. `/recommendations/:id`

### API

1. `GET /api/recommendations`
2. `GET /api/recommendations?id=...`
3. `GET /api/recommendations?practitioner_id=...`
4. `GET /api/recommendations/:id`
5. `POST /api/recommendations`
6. `PATCH /api/recommendations`
7. `DELETE /api/recommendations`
 