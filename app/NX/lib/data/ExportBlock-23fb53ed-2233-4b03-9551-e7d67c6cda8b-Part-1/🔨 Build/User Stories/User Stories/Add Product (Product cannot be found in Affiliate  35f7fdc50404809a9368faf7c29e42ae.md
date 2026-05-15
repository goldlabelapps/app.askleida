# Add Product (Product cannot be found in Affiliate database)

Category: Products
Code: PROD 02b
Done When:   • When a search returns no results Leida automatically queries external sources including the Awin product data feed 
  • A suggested product card appears with name, brand, image, description and category pre-populated from the external source
  • Practitioner sees two clear options — confirm (yes that's the one) or reject (no try again)
  • Confirmed products are added to the practitioner's personal list immediately
  • Confirmed products are also added to the master database simultaneously so other practitioners can find them in future
  • Duplicate detection prevents the same product being added twice — unique identifier used is the Awin product ID or EAN barcode rather than product name (?)
  • If Awin returns no result the practitioner is directed to PROD-03 manual entry
  • Product is marked as ‘verified’ in the database to distinguish it from manually entered products
Phase: Phase 1
Status: Not started
Story: As a practitioner, I want Leida to automatically find and suggest a product when it doesn't appear in the master database, so that I can add it quickly without entering all the details manually.