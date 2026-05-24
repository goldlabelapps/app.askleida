'use client';
import * as React from 'react';
import {
  Alert,
  Button,
  Container,
  Typography,
  Box,
  Collapse,
} from '@mui/material';
import { init, useState, Product, Create } from '../../NX/Products';
import { useDispatch } from '../../NX/Uberedux';
import { Icon } from '../../NX/DesignSystem';

export default function Products() {
  const [showCreate, setShowCreate] = React.useState(false);
  const dispatch = useDispatch();
  const state = useState();
  const {
    error,
    initted,
    pagination,
    search,
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
    <>
      <Box>
        <Button
          fullWidth
          startIcon={<Icon icon={'add'} />}
          variant={showCreate ? 'outlined' : 'contained'}
          color="primary"
          sx={{ mb: 2 }}
          onClick={() => setShowCreate((v) => !v)}
        >
          {showCreate ? 'Close Create Form' : 'Add Product'}
        </Button>
        <Collapse in={showCreate} sx={{ mb: 3 }}>
          <Create />
        </Collapse>
        {pagination && (
          <Typography variant="subtitle1" sx={{ mb: 2 }} align="center">
            {(() => {
              const { page, limit, total } = pagination;
              if (!page || !limit || !total) return null;
              const start = (page - 1) * limit + 1;
              const end = Math.min(page * limit, total);
              return `Showing ${start}-${end} of ${total} results`;
            })()}
          </Typography>
        )}

        {search && search.searchStr && (
          <Typography variant="subtitle2" align="center" sx={{ mb: 2 }}>
            {search.searchStr}
          </Typography>
        )}

        {results && results.length === 0 && (
          <Typography variant="body1" align="center" sx={{ mb: 2 }}>
            No results found.
          </Typography>
        )}

        {results && results.length > 0 && (
          <>
            {results.map((order: any, idx: number) => (
              <Product {...order} key={`order_${idx}`} />
            ))}
          </>
        )}
      </Box>
    </>
  );
}

