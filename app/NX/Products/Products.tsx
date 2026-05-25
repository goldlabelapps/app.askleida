'use client';
import * as React from 'react';
import {
  Alert,
  Button,
  Container,
  Typography,
  Box,
} from '@mui/material';
import { init, useState, ProductCard } from '../../NX/Products';
import { useDispatch } from '../../NX/Uberedux';
import { Icon } from '../../NX/DesignSystem';

export default function Products({ slug }: { slug?: string }) {
  const dispatch = useDispatch();
  const state = useState();
  const {
    error,
    initted,
    results,
  } = state || {};

  React.useEffect(() => {
    if (!initted) {
      dispatch(init());
    }
  }, [initted, dispatch]);

  if (!initted) return null;

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Alert severity="info" sx={{ my: 2 }}
          action={
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box>
      {/* <Button
        startIcon={<Icon icon="add" />}
        variant="contained"
        color="primary"
        onClick={() => window.location.assign('/products/new')}
      >
        Create
      </Button> */}
      {results && results.length > 0 ? (
        results.map((product: any, idx: number) => (
          <Box key={`product_${idx}`}>
            <ProductCard product={product} />
          </Box>
        ))
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

