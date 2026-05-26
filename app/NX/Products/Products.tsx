'use client';
import * as React from 'react';
import {
  Typography,
  Box,
  Grid,
} from '@mui/material';
import { init, useState, ProductCard } from '../../NX/Products';
import { useDispatch } from '../../NX/Uberedux';

export default function Products({ slug }: { slug?: string }) {
  const dispatch = useDispatch();
  const state = useState();
  const {
    initted,
    results,
  } = state || {};

  React.useEffect(() => {
    if (!initted) {
      dispatch(init());
    }
  }, [initted, dispatch]);

  if (!initted) return null;

  return (
    <Box>
      {results && results.length > 0 ? (
        <Grid container spacing={1} sx={{  }}>
        {results.map((product: any, idx: number) => (
          <Grid 
            key={`product_${idx}`}
            size={{
              sm: 12,
              md: 6,
            }}
          >
            <ProductCard product={product} />
          </Grid>
        ))}
        </Grid>
      ) : (
        <Typography variant="body1" align="center" sx={{ mt: 4 }}>
          No products found.
        </Typography>
      )}
    </Box>
  );
}

/*
<Product {...order} key={`order_${idx}`} />
*/

