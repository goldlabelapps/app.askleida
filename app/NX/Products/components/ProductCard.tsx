'use client';
import * as React from 'react';
import type { FC } from 'react';
import { Card, CardHeader, CardContent, Typography, CardActionArea } from '@mui/material';
import type { I_Product } from '../types';
import { useRouter } from 'next/navigation';
import { useDispatch } from '../../Uberedux';
import { navigateTo } from '../../DesignSystem';

const ProductCard: FC<{ product?: I_Product }> = ({ product }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  if (!product) return null;

  const handleClick = () => {
    if (product.slug) {
      dispatch(navigateTo(router, `/products/${product.slug}`));
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea onClick={handleClick} sx={{ height: '100%' }}>
        <CardHeader
          title={
            <Typography variant="h6" noWrap>
              {product.title || product.name || 'Untitled'}
            </Typography>
          }
          subheader={product.brand || ''}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary" noWrap>
            {product.description || ''}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProductCard;
