'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
    Box,
Paper,
Stack,
Chip,
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
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 2,
                }}
            >
                <Stack spacing={2}>
                    <Chip label='Planned Product Pipeline' />
                    <Typography variant='h5' fontWeight={700}>
                        (Lookfantastic &rarr; Supabase &rarr; Leida)
                    </Typography>
                    <Typography color='text.secondary'>
                        We are preparing to ingest Lookfantastic&apos;s 25k-row CSV into Postgres on Supabase,
                        then expose fast product search from that source table.
                    </Typography>
                    <Typography color='text.secondary'>
                        The source table will be refreshed by a cron job whenever feed changes are detected
                        from Awin.
                    </Typography>
                    <Typography color='text.secondary'>
                        Products will then be read from that table, reshaped into Leida product records,
                        and tuned by AI (Claude) before being written into the `products` table.
                    </Typography>
                </Stack>
            </Paper>
        </Box>
    );
}
