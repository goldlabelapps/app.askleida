'use client';
import * as React from 'react';
import type { FC } from 'react';
import { Card, CardHeader, CardContent, Typography, Grid, Divider, Box, Chip } from '@mui/material';
import type { I_Product } from '../types';
import { Thumbnail } from '../../Products';
import he from 'he';

const ProductDetail: FC<{ product: I_Product }> = ({ product }) => {
  const decodedTitle = product.title ? he.decode(product.title) : product.name || 'Untitled';

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardHeader
        title={product.brand}
      />
      <Divider />
      <CardContent>
        <Grid container spacing={3}>
          {product.image_url && (
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                <Thumbnail src={product.image_url as string} alt={decodedTitle} size={300} />
              </Box>
            </Grid>
          )}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
              {product.description}
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {product.routine_step && <li><b>Routine Step:</b> {product.routine_step}</li>}
              {product.treat_sublabel && <li><b>Treat Sublabel:</b> {product.treat_sublabel}</li>}
              {/* {product.distribution_type && <li><b>Distribution Type:</b> {product.distribution_type}</li>} */}
              {product.website_url && <li><b>Website:</b> <a href={product.website_url} target="_blank" rel="noopener noreferrer">{product.website_url}</a></li>}
              {product.claude_description && <li><b>Claude Description:</b> {product.claude_description}</li>}
              {product.how_to_apply && <li><b>How to Apply:</b> {product.how_to_apply}</li>}
              {product.active_ingredients && <li><b>Active Ingredients:</b> {product.active_ingredients}</li>}
              {product.contraindications && <li><b>Contraindications:</b> {product.contraindications}</li>}
              {typeof product.is_pregnancy_safe === 'boolean' && <li><b>Pregnancy Safe:</b> {product.is_pregnancy_safe ? 'Yes' : 'No'}</li>}
              {typeof product.is_breastfeeding_safe === 'boolean' && <li><b>Breastfeeding Safe:</b> {product.is_breastfeeding_safe ? 'Yes' : 'No'}</li>}
              {Array.isArray(product.skin_type_tags) && product.skin_type_tags.length > 0 && (
                <li><b>Skin Types:</b> {product.skin_type_tags.join(', ')}</li>
              )}
              {Array.isArray(product.concern_tags) && product.concern_tags.length > 0 && (
                <li><b>Concerns:</b> {product.concern_tags.join(', ')}</li>
              )}
              {typeof product.is_verified === 'boolean' && <li><b>Verified:</b> {product.is_verified ? 'Yes' : 'No'}</li>}
              {typeof product.is_seeded === 'boolean' && <li><b>Seeded:</b> {product.is_seeded ? 'Yes' : 'No'}</li>}
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="h5" color="primary">
                {typeof product.price === 'number'
                  ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(product.price)
                  : '--'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProductDetail;
