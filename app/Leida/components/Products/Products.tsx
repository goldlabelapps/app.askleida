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

export default function Products() {

    const router = useRouter();
    const { user } = useSupabaseAuth();
    const dispatch = useDispatch();
    const products = useProducts();
    const list = Array.isArray(products?.list) ? products.list : [];
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
                            {list.map((product: any) => {
                                const name = product?.data?.name || product?.name || product?.title || 'Unnamed product';
                                const category = product?.data?.category || product?.category || 'No category';
                                const rawPrice = product?.data?.price ?? product?.price;
                                const numericPrice = typeof rawPrice === 'number'
                                    ? rawPrice
                                    : typeof rawPrice === 'string'
                                        ? Number(rawPrice)
                                        : NaN;
                                const priceText = Number.isFinite(numericPrice)
                                    ? `£${numericPrice.toFixed(2)}`
                                    : 'No price';
                                const productId = product?.product_id;
                                const subheader = `${category} • ${priceText}`;
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
