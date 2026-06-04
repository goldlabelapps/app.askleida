'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
    Box,
    Button,
} from '@mui/material';
import { navigateTo, Icon } from '../../../NX/DesignSystem';
import { useDispatch } from '../../../NX/Uberedux';

const GameMenu: React.FC = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleClick = React.useCallback((route: string) => {
        dispatch(navigateTo(router, route));
    }, [dispatch, router]);

    return (
        <>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 300, gap: 1, mx: 'auto' }}>
            <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<Icon icon="clients" />}
                onClick={() => handleClick('/clients')} 
                fullWidth>
                Clients
            </Button>
            <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<Icon icon="tips" />}
                onClick={() => handleClick('/tips')} 
                fullWidth 
            >
                Tips
            </Button>
        </Box>
            
        </>
    );
};

export default GameMenu;