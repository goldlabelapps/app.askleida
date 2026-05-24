# Product Feature: Developer Brief

## Overview

Build a UI to allow practitioners to fully manage (CRUD) their product records in Supabase via the Next.js API endpoints. The UI must cover all the following requirements:

---

## Requirements

### 1. Product Search

- Search bar on the product screen
- Live results as user types (min 2 characters)
- Show product name, brand, and image (if available)
- “Add to database” option for products not in user’s database
- Open product card for full details and “Add to my database” button
- Search works on product name & brand

### 2. Add Product from Master Database

- Tap a search result to add to personal database in one action
- Product appears in list immediately
- Prevent duplicates; indicate if already saved
- Mobile-friendly (keyboard does not obscure dropdown)

### 3. Add Product Manually

- Manual add option if no search results or user chooses
- **Required:** product name, brand, category (cleanse/treat/moisturise/SPF/other, auto-capitalize first letter)
- **Optional:** description, how to apply, contraindications, price, link, image
- Save to user’s database only

### 4. View and Edit Products

- List all products in user’s database
- Sort by category or brand
- Tap product for detail view
- All fields editable (TBC)
- Changes save immediately with confirmation
- Editing does not alter master database

### 5. Remove a Product

- Delete option for each product
- Confirmation step before deletion (cannot be undone, but allow “ready” state if they change their mind)
- Remove from list immediately
- Deleting does not affect existing recommendations

### 6. Add Product from External Source

- When search returns no results, query external sources (e.g., Awin feed)
- Show suggested product card with pre-populated fields
- User can confirm (add) or reject (try again)
- Confirmed products added to user’s list and master database
- Prevent duplicates using unique identifiers (Awin product ID or EAN barcode)
- If still not found, direct to manual entry
- Mark externally sourced products as ‘verified’


## Acceptance Criteria

- All requirements above are covered
- UI is intuitive, fast, and matches described flows
- All CRUD operations work reliably with Supabase via the API
- No duplicate products can be added
- All changes are reflected immediately in the UI
