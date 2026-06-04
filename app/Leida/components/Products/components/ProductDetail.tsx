"use client";
import React from 'react';
import type { T_Product } from '../types';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Chip,
  Fab,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { Icon, navigateTo, ConfirmAction } from '../../../../NX/DesignSystem';
import { useDispatch } from '../../../../NX/Uberedux';
import { deleteProduct, patchProduct } from '../../Products';

type T_ProductRecord = T_Product & {
  product_id?: string | null;
  title?: string | null;
  data?: T_Product['data'] | null;
};

type T_ProductDetailProps = {
  config?: unknown;
  product?: T_ProductRecord | null;
};

const getStringValue = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const getDataObject = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
};

const getNumberValue = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const cloneProduct = (value: T_ProductRecord | null | undefined): T_ProductRecord | null => {
  if (!value) {
    return null;
  }

  return JSON.parse(JSON.stringify(value)) as T_ProductRecord;
};

const areProductsEqual = (left: T_ProductRecord | null, right: T_ProductRecord | null): boolean => {
  if (!left && !right) {
    return true;
  }

  if (!left || !right) {
    return false;
  }

  return JSON.stringify(left) === JSON.stringify(right);
};

const ProductDetail: React.FC<T_ProductDetailProps> = ({ config, product }) => {
  void config;

  const router = useRouter();
  const dispatch = useDispatch();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isPatching, setIsPatching] = React.useState(false);
  const [originalProduct, setOriginalProduct] = React.useState<T_ProductRecord | null>(cloneProduct(product));
  const [draftProduct, setDraftProduct] = React.useState<T_ProductRecord | null>(cloneProduct(product));

  React.useEffect(() => {
    const nextProduct = cloneProduct(product);
    setOriginalProduct(nextProduct);
    setDraftProduct(nextProduct);
  }, [product]);

  const isDirty = !areProductsEqual(originalProduct, draftProduct);
  const activeProduct = draftProduct ?? product ?? null;
  const productData = getDataObject(activeProduct?.data);
  const productId = getStringValue(activeProduct?.product_id) || getStringValue(activeProduct?.id);

  const name = getStringValue(productData.name) || getStringValue(activeProduct?.name) || getStringValue(activeProduct?.title) || '';
  const brand = getStringValue(productData.brand) || '';
  const imageUrl = getStringValue(productData.image_url);
  const websiteUrl = getStringValue(productData.website_url);
  const routineStep = getStringValue(productData.routine_step);
  const distributionType = getStringValue(productData.distribution_type);
  const howToApply = getStringValue(productData.how_to_apply);
  const isVerified = productData.is_verified === true;
  const isSeeded = productData.is_seeded === true;
  const isPregnancySafe = productData.is_pregnancy_safe === true;
  const isBreastfeedingSafe = productData.is_breastfeeding_safe === true;

  const concernTags = Array.isArray(productData.concern_tags)
    ? productData.concern_tags.filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
    : [];
  const skinTypeTags = Array.isArray(productData.skin_type_tags)
    ? productData.skin_type_tags.filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
    : [];

  const description = getStringValue(productData.description) || getStringValue(activeProduct?.description) || '';
  const created = getStringValue(activeProduct?.created) || getStringValue(activeProduct?.created_at);
  const updated = getStringValue(activeProduct?.updated);

  if (!activeProduct) {
    if (isDeleting) {
      return null;
    }
    return null;
  }

  const handleProductsNavigate = () => {
    dispatch(navigateTo(router, '/products'));
  };

  const handleNew = () => {
    dispatch(navigateTo(router, '/products/new'));
  };

  const handleOpenDeleteConfirm = () => {
    setConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setConfirmOpen(false);
  };

  const handleDelete = async () => {
    if (!productId) {
      setConfirmOpen(false);
      return;
    }

    setIsDeleting(true);
    setConfirmOpen(false);
    await dispatch(deleteProduct(productId));
    handleProductsNavigate();
  };

  const handleDataChange = (key: string, nextValue: string) => {
    setDraftProduct((currentProduct) => {
      if (!currentProduct) {
        return currentProduct;
      }

      const currentData = getDataObject(currentProduct.data);
      return {
        ...currentProduct,
        data: {
          ...currentData,
          [key]: nextValue,
        },
      };
    });
  };

  const handlePatch = async () => {
    if (!draftProduct || !productId || !isDirty || isPatching) {
      return;
    }

    const draftData = getDataObject(draftProduct.data);
    const normalizedName = getStringValue(draftData.name) || '';
    const normalizedCategory = getStringValue(draftData.category) || '';
    const normalizedSku = getStringValue(draftData.sku) || '';
    const normalizedDescription = getStringValue(draftData.description) || '';
    const normalizedNotes = getStringValue(draftData.notes) || '';
    const normalizedPrice = getNumberValue(draftData.price);

    if (!normalizedName) {
      return;
    }

    setIsPatching(true);
    const success = await dispatch(
      patchProduct(productId, {
        title: normalizedName,
        name: normalizedName,
        category: normalizedCategory || null,
        sku: normalizedSku || null,
        price: normalizedPrice,
        description: normalizedDescription || null,
        notes: normalizedNotes || null,
        data: {
          ...draftData,
          name: normalizedName,
          category: normalizedCategory || null,
          sku: normalizedSku || null,
          price: normalizedPrice,
          description: normalizedDescription || null,
          notes: normalizedNotes || null,
        },
      }),
    );
    setIsPatching(false);

    if (success) {
      handleProductsNavigate();
    }
  };

  return (
    <>
      <Box>
        <Collapse in={isDirty} unmountOnExit>
          <Box
            sx={{
              position: 'fixed',
              right: { xs: 16, sm: 24 },
              bottom: { xs: 16, sm: 24 },
              zIndex: (theme) => theme.zIndex.appBar + 1,
            }}
          >
            <Fab color="primary" disabled={isPatching || !name.trim()} onClick={handlePatch}>
              <Icon icon="save" />
            </Fab>
          </Box>
        </Collapse>

        <CardHeader
          avatar={
            <>
              <IconButton color="primary" onClick={handleProductsNavigate}>
                <Icon icon="products" />
              </IconButton>
            </>
          }
          action={
            <>
              <Button endIcon={<Icon icon="add" />} color="primary" onClick={handleNew}>
                New
              </Button>
              <IconButton color="primary" onClick={handleOpenDeleteConfirm}>
                <Icon icon="delete" />
              </IconButton>
            </>
          }
        />

        <CardContent>
          <Stack spacing={2.5}>
            {imageUrl ? (
              <Box
                component="img"
                src={imageUrl}
                alt={name || 'Product image'}
                sx={{
                  width: '100%',
                  maxWidth: 280,
                  borderRadius: 2,
                  objectFit: 'cover',
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              />
            ) : null}

            <Box>
              <Typography variant="h5">{name || 'Unnamed product'}</Typography>
              {brand ? (
                <Typography variant="subtitle1" color="text.secondary">
                  {brand}
                </Typography>
              ) : null}
            </Box>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip size="small" color={isVerified ? 'success' : 'default'} label={isVerified ? 'Verified' : 'Unverified'} />
              <Chip size="small" color={isSeeded ? 'info' : 'default'} label={isSeeded ? 'Seeded' : 'User Added'} />
              <Chip
                size="small"
                color={isPregnancySafe ? 'success' : 'default'}
                label={isPregnancySafe ? 'Pregnancy Safe' : 'Not Pregnancy Safe'}
              />
              <Chip
                size="small"
                color={isBreastfeedingSafe ? 'success' : 'default'}
                label={isBreastfeedingSafe ? 'Breastfeeding Safe' : 'Not Breastfeeding Safe'}
              />
            </Stack>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">Routine Step</Typography>
                <Typography>{routineStep || 'Not set'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">Distribution</Typography>
                <Typography>{distributionType || 'Not set'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">Created</Typography>
                <Typography>{created || 'Unknown'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">Updated</Typography>
                <Typography>{updated || 'Unknown'}</Typography>
              </Grid>
            </Grid>

            {websiteUrl ? (
              <Box>
                <Typography variant="caption" color="text.secondary">Website</Typography>
                <Typography>
                  <Link href={websiteUrl} target="_blank" rel="noopener noreferrer">
                    {websiteUrl}
                  </Link>
                </Typography>
              </Box>
            ) : null}

            {description ? (
              <Box>
                <Typography variant="subtitle2">Description</Typography>
                <Typography color="text.secondary">{description}</Typography>
              </Box>
            ) : null}

            {howToApply ? (
              <Box>
                <Typography variant="subtitle2">How to apply</Typography>
                <Typography color="text.secondary">{howToApply}</Typography>
              </Box>
            ) : null}

            {concernTags.length > 0 ? (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Concern tags</Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {concernTags.map((tag) => (
                    <Chip key={`concern-${tag}`} size="small" label={tag} />
                  ))}
                </Stack>
              </Box>
            ) : null}

            {skinTypeTags.length > 0 ? (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Skin type tags</Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {skinTypeTags.map((tag) => (
                    <Chip key={`skin-${tag}`} size="small" label={tag} />
                  ))}
                </Stack>
              </Box>
            ) : null}

            <Divider />
            <Typography variant="caption" color="text.secondary">
              Product ID: {productId || 'Unavailable'}
            </Typography>
          </Stack>
        </CardContent>

        <CardActions>
          <Button fullWidth startIcon={<Icon icon="left" />} variant="text" onClick={handleProductsNavigate}>
            Back
          </Button>
        </CardActions>

        <ConfirmAction
          open={confirmOpen}
          icon="delete"
          title="Delete Product?"
          body="Are you sure you want to delete this product? This action cannot be undone."
          handleConfirm={handleDelete}
          handleClose={handleCloseDeleteConfirm}
        />
      </Box>
    </>
  );
};

export default ProductDetail;
