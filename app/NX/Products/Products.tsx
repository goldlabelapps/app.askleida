'use client';
import * as React from 'react';
import {
  Typography,
  Box,
  Grid,
  Pagination,
  Button,
} from '@mui/material';
import { init, useState, ProductCard, setKey, search } from '../../NX/Products';
import { useDispatch } from '../../NX/Uberedux';
import { MightyButton } from '../../NX/DesignSystem';

export default function Products({ slug }: { slug?: string }) {
  const dispatch = useDispatch();
  const state = useState();
  const {
    initted,
    results,
    pagination,
    searchParams = {},
    search: searchMeta,
    loading,
  } = state || {};

  React.useEffect(() => {
    if (!initted) {
      dispatch(init());
    }
  }, [initted, dispatch]);

  if (!initted) return null;

  // Results summary
  let summary = null;
  if (pagination && typeof pagination.total === 'number') {
    if (searchParams.s) {
      summary = `${pagination.total} product${pagination.total === 1 ? '' : 's'} containing "${searchParams.s}"`;
    } else {
      summary = `${pagination.total} product${pagination.total === 1 ? '' : 's'}`;
    }
  }

  // Handle page change
  const handlePageChange = (_: any, value: number) => {
    dispatch(setKey('searchParams', { ...searchParams, page: value }));
    dispatch(search());
  };

  // Clear search
  const handleClearSearch = () => {
    dispatch(setKey('searchParams', { ...searchParams, s: '', page: 1 }));
    dispatch(search());
  };

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

      {summary && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 2, gap: 2 }}>
          <Typography variant="subtitle1">{summary}</Typography>
          {searchParams.s && (
            <MightyButton
              variant="outlined"
              icon="close"
              label="Clear"
              onClick={handleClearSearch}
            />
          )}
        </Box>
      )}
      {pagination && pagination.total_pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={pagination.total_pages}
            page={searchParams.page || 1}
            onChange={handlePageChange}
            color="primary"
            disabled={loading}
          />
        </Box>
      )}
      
    </Box>
  );
}

/*
<Product {...order} key={`order_${idx}`} />
*/

