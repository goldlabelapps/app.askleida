# Account Data & API

This folder contains:
- Example account data (`accounts_rows.csv`)
- API route handlers for account CRUD operations

## Account Data Structure (`accounts_rows.csv`)
Each row represents a user account with the following fields:

| Column     | Description                                 |
|------------|---------------------------------------------|
| user_id    | Unique account identifier (UUID)            |
| email      | User email address                          |
| name       | User's display name                         |
| created_at | Timestamp of account creation               |
| avatar     | Avatar image URL                            |
| level      | User level/role (integer)                   |
| updated_at | Timestamp of last update                    |

## API Endpoints
- `GET /api/accounts` — List all accounts or fetch by `user_id`
- `POST /api/accounts` — Create a new account (JSON body)
- `PATCH /api/accounts` — Update an account (by `user_id`)
- `DELETE /api/accounts` — Delete an account (by `user_id`)

## Notes
- Some fields may be empty for certain accounts.
- Use the `level` field for role-based access or permissions.
- See the CSV for real data examples.
