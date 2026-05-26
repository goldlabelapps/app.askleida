'use client';
import * as React from 'react';
import type { FC } from 'react';
import { Card, CardHeader, Typography, CardActionArea } from '@mui/material';
import type { I_Product } from '../types';
import Thumbnail from './Thumbnail';
import { useRouter } from 'next/navigation';
import { useDispatch } from '../../Uberedux';

const ProductCard: FC<{ product?: I_Product }> = ({ product }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  if (!product) return null;

  // Get current search param from Redux (if any)
  const state = typeof window !== 'undefined' ? (window.__NEXT_DATA__?.props?.pageProps?.reduxState?.products || {}) : {};
  const searchParams = state.searchParams || {};
  const handleClick = () => {
    if (product.slug) {
      const s = searchParams.s ? `?s=${encodeURIComponent(searchParams.s)}` : '';
      router.push(`/products/${product.slug}${s}`);
    }
  };

  return (
    <Card sx={{ width: '100%' }} variant="outlined">
      <CardActionArea onClick={handleClick} sx={{  }}>
        <CardHeader
          title={
            <Typography variant="body1" noWrap>
              {product.brand}
            </Typography>
          }
          subheader={
            <Typography variant="body2" noWrap>
              {product.title}
            </Typography>
          }
          avatar={
            product.image_url ? (
              <Thumbnail src={product.image_url} alt={product.title || ''} size={48} />
            ) : null
          }
        />
      </CardActionArea>
    </Card>
  );
};

export default ProductCard;
