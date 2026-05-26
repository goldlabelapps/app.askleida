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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import type { I_Product } from '../types';
import { Thumbnail } from '../../Products';
import { MightyButton } from '../../DesignSystem';
import ConfirmAction from '../../DesignSystem/components/ConfirmAction';
import { useDispatch } from '../../Uberedux';
import { deleteProduct } from '../actions/deleteProduct';
import he from 'he';

const ProductDetail: FC<{ product: I_Product }> = ({ product }) => {
  const decodedTitle = product.title ? he.decode(product.title) : product.name || 'Untitled';
  const router = useRouter();
  const dispatch = useDispatch();
  const [confirmOpen, setConfirmOpen] = React.useState(false);

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
            <Box gap={1} sx={{ display: 'flex', alignItems: 'center' }}>
              

              {product.website_url && product.website_url.startsWith('https://') && (
                <MightyButton
                  variant="outlined"
                  icon="link"
                  label="Website"
                  onClick={() => window.open(product.website_url!, '_blank')}
                />
              )}
              
              <MightyButton
                variant="outlined"
                icon="delete"
                label="Delete"
                onClick={() => setConfirmOpen(true)}
              />
                  <ConfirmAction
                    open={confirmOpen}
                    icon="delete"
                    title="Delete Product?"
                    body={`Are you sure you want to delete this product? This action cannot be undone.`}
                    handleConfirm={async () => {
                      setConfirmOpen(false);
                      if (product.product_id) {
                        await dispatch(deleteProduct(product.product_id));
                        router.push('/products');
                      }
                    }}
                    handleClose={() => setConfirmOpen(false)}
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
        </Grid>
        <Grid size={{
          xs: 12,
        }}>
          <CardContent>
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!product.is_pregnancy_safe}
                  disabled
                  color="success"
                />
              }
              label="Pregnancy Safe"
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!product.is_breastfeeding_safe}
                  disabled
                  color="success"
                />
              }
              label="Breastfeeding Safe"
              sx={{ mb: 2 }}
            />
            {product.concern_tags && Array.isArray(product.concern_tags) && product.concern_tags.length > 0 && (
              <>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {product.concern_tags.map((tag: string, idx: number) => (
                    <Chip key={idx} color="primary" label={typeof tag === 'string' ? tag.charAt(0).toUpperCase() + tag.slice(1) : tag} variant="outlined" clickable={false} />
                  ))}
                </Box>
              </>
            )}

            {product.skin_type_tags && Array.isArray(product.skin_type_tags) && product.skin_type_tags.length > 0 && (
              <>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {product.skin_type_tags.map((tag: string, idx: number) => (
                    <Chip key={idx} label={tag} variant="outlined" clickable={false} />
                  ))}
                </Box>
              </>
            )}
          </CardContent>
        </Grid>
      </Grid>
      
    </Card>
  );
};

export default ProductDetail;
