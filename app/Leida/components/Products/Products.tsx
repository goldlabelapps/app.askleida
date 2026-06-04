'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
    Box,
    Alert,
    Button,
    CardHeader,
    CircularProgress,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material';
import { useDispatch } from '../../../NX/Uberedux';
import { Icon, navigateTo } from '../../../NX/DesignSystem';
import { useSupabaseAuth } from '../../../NX/Paywall';
import { initProducts, useProducts } from '../Products';
import type { T_Product } from './types';

export default function Products() {

    const router = useRouter();
    const { user } = useSupabaseAuth();
    const dispatch = useDispatch();
    const products = useProducts();
    const list: T_Product[] = Array.isArray(products?.list) ? (products.list as T_Product[]) : [];
    const titleText = list.length > 0 ? `Products (${list.length})` : 'Products';
    
    React.useEffect(() => {
        if (!products?.initted && !products?.loading && user?.id) {
            dispatch(initProducts());
        }
    }, [dispatch, products?.initted, products?.loading, user?.id]);

    const handleNew = () => {
        dispatch(navigateTo(router, '/products/new'));
    };

    return (
        <Box>
            <CardHeader 
                avatar={<>
                    {products?.loading ? <CircularProgress size={20} /> : 
                    <Box sx={{mt:1, ml:1}}>
                        <Icon icon="products" color="primary" />
                    </Box>}
                </>}
                title={<Typography variant="h6">{titleText}</Typography>}
                action={<>
                    <Button
                        endIcon={<Icon icon="add" />}
                        color="primary"
                        onClick={handleNew}
                    >
                        New
                    </Button>
                </>}
            />
            
                {products?.loading ? null : products?.error ? (
                    <Alert severity="error">{String(products.error)}</Alert>
                ) : (
                    <>
                        <List dense>
                            {list.map((product: T_Product) => {
                                const name = product?.data?.name || product?.title || product?.name || 'Unnamed product';
                                const brand = product?.data?.brand || 'Unknown brand';
                                const routineStep = product?.data?.routine_step || null;
                                const distributionType = product?.data?.distribution_type || null;
                                const isVerified = product?.data?.is_verified === true;
                                const concernTags = Array.isArray(product?.data?.concern_tags)
                                    ? product.data?.concern_tags
                                    : [];
                                const productId = product?.product_id;
                                const subheaderParts = [brand, routineStep].filter(Boolean);
                                const tagsText = concernTags.length > 0
                                    ? `${concernTags.length} concern tag${concernTags.length === 1 ? '' : 's'}`
                                    : null;
                                
                                const subheader = [
                                    subheaderParts.length > 0 ? subheaderParts.join(' • ') : null,
                                    tagsText,
                                ].filter(Boolean).join(' • ');
                                const itemKey = String(productId || name);


                                return (
                                    <ListItem key={itemKey} disablePadding>
                                        <ListItemButton
                                            disabled={!productId}
                                            onClick={() => {
                                                if (productId) {
                                                    dispatch(navigateTo(router, `/products/${productId}`));
                                                }
                                            }}
                                        >
                                            <ListItemText 
                                                primary={<Typography variant="subtitle1">
                                                            {name}
                                                        </Typography>} 
                                                secondary={subheader}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </>
                )}
        </Box>
    );
}
