'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
} from '@mui/material';
import { navigateTo, Icon } from '../../../../DesignSystem';
import { useDispatch } from '../../../../Uberedux';
import {useDoc} from '../../Prospects';

export default function Surface() {
 
    const dispatch = useDispatch();
    const router = useRouter();

    return (
        <Box>
            <Button 
                variant="contained" 
                startIcon={<Icon icon="user" />}
                onClick={() => dispatch(navigateTo( router, '/prospects'))}
            >  
                Prospects
            </Button>
        </Box>
    );
}
