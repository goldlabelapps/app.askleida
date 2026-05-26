'use client';
import * as React from 'react';
import type { FC } from 'react';
import { Card, CardHeader, CardContent, Typography, CardActionArea } from '@mui/material';
import type { I_Product } from '../types';
import Thumbnail from './Thumbnail';
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
    <Card sx={{ width: '100%' }}>
      <CardActionArea onClick={handleClick} sx={{  }}>
        <CardHeader
          title={
            <Typography variant="body1" noWrap>
              {product.title}
            </Typography>
          }
          action={
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
