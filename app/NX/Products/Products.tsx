'use client';
import * as React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
} from '@mui/material';
import { init, useState, Product, Create } from '../../NX/Products';
import { useDispatch } from '../../NX/Uberedux';
import { Icon } from '../../NX/DesignSystem';

export default function Products({ slug }: { slug?: string }) {
  const [showCreate] = React.useState(false);
  const dispatch = useDispatch();
  const state = useState();
  const {
    initted,
  } = state || {};

  React.useEffect(() => {
    if (!initted) {
      dispatch(init());
    }
  }, [initted, dispatch]);

  if (!initted) return null;


  return (
    <>
      <Box>
        <Card>
          <CardContent>
            <Typography variant="h4" mt={3} mb={1}>Github Task</Typography>
            <Typography paragraph>
              Build a UI to allow practitioners to fully manage (CRUD) their product records in Supabase via the Next.js API endpoints. The UI must cover all the following requirements:
            </Typography>
          </CardContent>
        </Card>
        <Typography variant="h6" mt={3} mb={1}>Requirements</Typography>
        <Typography variant="subtitle1" mt={2} mb={1}>1. Product Search</Typography>
        <Typography component="ul" sx={{ pl: 3 }}>
          <li>Search bar on the product screen</li>
          <li>Live results as user types (min 2 characters)</li>
          <li>Show product name, brand, and image (if available)</li>
          <li>“Add to database” option for products not in user’s database</li>
          <li>Open product card for full details and “Add to my database” button</li>
          <li>Search works on product name & brand</li>
        </Typography>
        <Typography variant="subtitle1" mt={2} mb={1}>2. Add Product from Master Database</Typography>
        <Typography component="ul" sx={{ pl: 3 }}>
          <li>Tap a search result to add to personal database in one action</li>
          <li>Product appears in list immediately</li>
          <li>Prevent duplicates; indicate if already saved</li>
          <li>Mobile-friendly (keyboard does not obscure dropdown)</li>
        </Typography>
        <Typography variant="subtitle1" mt={2} mb={1}>3. Add Product Manually</Typography>
        <Typography component="ul" sx={{ pl: 3 }}>
          <li><b>Required:</b> product name, brand, category (cleanse/treat/moisturise/SPF/other, auto-capitalize first letter)</li>
          <li><b>Optional:</b> description, how to apply, contraindications, price, link, image</li>
          <li>Save to user’s database only</li>
        </Typography>
        <Typography variant="subtitle1" mt={2} mb={1}>4. View and Edit Products</Typography>
        <Typography component="ul" sx={{ pl: 3 }}>
          <li>List all products in user’s database</li>
          <li>Sort by category or brand</li>
          <li>Tap product for detail view</li>
          <li>All fields editable (TBC)</li>
          <li>Changes save immediately with confirmation</li>
          <li>Editing does not alter master database</li>
        </Typography>
        <Typography variant="subtitle1" mt={2} mb={1}>5. Remove a Product</Typography>
        <Typography component="ul" sx={{ pl: 3 }}>
          <li>Delete option for each product</li>
          <li>Confirmation step before deletion (cannot be undone, but allow “ready” state if they change their mind)</li>
          <li>Remove from list immediately</li>
          <li>Deleting does not affect existing recommendations</li>
        </Typography>
        <Typography variant="subtitle1" mt={2} mb={1}>6. Add Product from External Source</Typography>
        <Typography component="ul" sx={{ pl: 3 }}>
          <li>When search returns no results, query external sources (e.g., Awin feed)</li>
          <li>Show suggested product card with pre-populated fields</li>
          <li>User can confirm (add) or reject (try again)</li>
          <li>Confirmed products added to user’s list and master database</li>
          <li>Prevent duplicates using unique identifiers (Awin product ID or EAN barcode)</li>
          <li>If still not found, direct to manual entry</li>
          <li>Mark externally sourced products as ‘verified’</li>
        </Typography>
        <Typography variant="h6" mt={3} mb={1}>Acceptance Criteria</Typography>
        <Typography component="ul" sx={{ pl: 3 }}>
          <li>All requirements above are covered</li>
          <li>UI is intuitive, fast, and matches described flows</li>
          <li>All CRUD operations work reliably with Supabase via the API</li>
          <li>No duplicate products can be added</li>
          <li>All changes are reflected immediately in the UI</li>
        </Typography>
      </Box>
    </>
  );
}

