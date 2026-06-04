"use client";
import React from 'react';
import type { T_Product } from '../types';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Fab,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Collapse,
  IconButton,
} from '@mui/material';
import { Icon, navigateTo, ConfirmAction } from '../../../../NX/DesignSystem';
import { useDispatch } from '../../../../NX/Uberedux';
import { deleteProduct, patchProduct } from '../../Products';
import { Editable } from '../../../../Leida';

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
  const category = getStringValue(productData.category) || getStringValue(activeProduct?.category) || '';
  const sku = getStringValue(productData.sku) || getStringValue(activeProduct?.sku) || '';
  const description = getStringValue(productData.description) || getStringValue(activeProduct?.description) || '';
  const notes = getStringValue(productData.notes) || getStringValue(activeProduct?.notes) || '';
  const priceValue = getNumberValue(productData.price ?? activeProduct?.price);
  const price = priceValue === null ? '' : String(priceValue);

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
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Editable label="Name" value={name} placeholder="Add product name" onChange={(value) => handleDataChange('name', value)} />
              <Box sx={{ my: 2 }} />
              <Editable label="Category" value={category} placeholder="Add category" onChange={(value) => handleDataChange('category', value)} />
              <Box sx={{ my: 2 }} />
              <Editable label="SKU" value={sku} placeholder="Add SKU" onChange={(value) => handleDataChange('sku', value)} />
              <Box sx={{ my: 2 }} />
              <Editable label="Price" value={price} placeholder="Add price" onChange={(value) => handleDataChange('price', value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Editable
                label="Description"
                value={description}
                placeholder="Add product description"
                multiline
                minRows={4}
                onChange={(value) => handleDataChange('description', value)}
              />
              <Box sx={{ my: 2 }} />
              <Editable
                label="Notes"
                value={notes}
                placeholder="Add internal notes"
                multiline
                minRows={4}
                onChange={(value) => handleDataChange('notes', value)}
              />
            </Grid>
          </Grid>
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
