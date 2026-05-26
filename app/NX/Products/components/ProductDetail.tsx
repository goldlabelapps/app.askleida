'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { 
  Card, 
  Grid, 
  CardContent, 
  Typography,
  Box, 
  Chip,
} from '@mui/material';
import type { I_Product } from '../types';
import { Thumbnail } from '../../Products';
import { MightyButton } from '../../DesignSystem';
import he from 'he';

const ProductDetail: FC<{ product: I_Product }> = ({ product }) => {
  const decodedTitle = product.title ? he.decode(product.title) : product.name || 'Untitled';
  const router = useRouter();

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <Grid container spacing={2} sx={{ p: 2 }}>

        <Grid size={{
          xs: 12,
        }}>
          <Box sx={{ display: 'flex' }}>
            <Box>
              <Typography variant="h5" color="text.primary" sx={{m: 1}}>
                {decodedTitle}
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }}/>
            <Box>
              <MightyButton
                variant="outlined"
                icon="edit"
                label="Edit"
                onClick={() => {
                  router.push(`/products/${product.slug}/edit`);
                }}
              />
            </Box>
          </Box>
        </Grid>

        {product.image_url && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              <Thumbnail src={product.image_url as string} alt={decodedTitle} size={'100%'} />
            </Box>
          </Grid>
        )}

        <Grid size={{
          xs: 12,
          md: product.image_url ? 6 : 12,
        }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            {product.brand}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {product.description}
          </Typography>

          {product.contraindications && (
            <>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Contraindications
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {product.contraindications}
              </Typography>
            </>
          )}

          {product.concern_tags && Array.isArray(product.concern_tags) && product.concern_tags.length > 0 && (
            <>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                Concerns {product.concern_tags.map((tag: string, idx: number) => (
                  <Chip key={idx} label={typeof tag === 'string' ? tag.charAt(0).toUpperCase() + tag.slice(1) : tag} variant="outlined" clickable={false} />
                ))}
              </Box>
            </>
          )}

          {product.skin_type_tags && Array.isArray(product.skin_type_tags) && product.skin_type_tags.length > 0 && (
            <>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                Skin {product.skin_type_tags.map((tag: string, idx: number) => (
                  <Chip key={idx} label={tag} variant="outlined" clickable={false} />
                ))}
              </Box>
            </>
          )}

       
        </Grid>
        <Grid size={{
          xs: 12,
        }}>
          <CardContent>
            

            {product.how_to_apply && (
              <>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Application
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {product.how_to_apply}
                </Typography>
              </>
            )}

            {product.active_ingredients && (
              <>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Active Ingredients
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {product.active_ingredients}
                </Typography>
              </>
            )}

            

            {product.is_pregnancy_safe && (
              <>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Pregnancy Safe
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {product.is_pregnancy_safe ? 'Yes' : 'No'}
                </Typography>
              </>
            )}

            {product.is_breastfeeding_safe && (
              <>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Breastfeeding Safe
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {product.is_breastfeeding_safe ? 'Yes' : 'No'}
                </Typography>
              </>
            )}

          </CardContent>
        </Grid>
      </Grid>
      
    </Card>
  );
};

export default ProductDetail;
