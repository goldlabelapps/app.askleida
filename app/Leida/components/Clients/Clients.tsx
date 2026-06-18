'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
    Box,
    Button,
} from '@mui/material';
import { useDispatch } from '../../../NX/Uberedux';
import { Icon, navigateTo } from '../../../NX/DesignSystem';
import { useClients } from '../Clients';

export default function Clients() {

    const router = useRouter();
    const dispatch = useDispatch();
    const slice = useClients();
    
    const handleNew = () => {
        dispatch(navigateTo(router, '/clients/new'));
    };

    return (
        <Box>
            <Box sx={{ my: 2 }}>
                <Button
                    fullWidth
                    size="large"
                    color="primary"
                    variant="outlined"
                    startIcon={<Icon icon="clients" />}
                    endIcon={<Icon icon="add" />}
                    onClick={handleNew}
                >
                    New Client
                </Button>
            </Box>

            <pre>slice: {JSON.stringify(slice, null, 2)}</pre>
        </Box>
    );
}
