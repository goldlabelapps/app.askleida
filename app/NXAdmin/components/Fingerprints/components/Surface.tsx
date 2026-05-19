'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
} from '@mui/material';
import { navigateTo, Icon } from '../../../../DesignSystem';
import { useDispatch } from '../../../../Uberedux';
import {useDoc} from '../../Fingerprints';

export default function Surface() {
 
    const dispatch = useDispatch();
    const router = useRouter();

    return (
        <Box>
            <Button 
                variant="contained" 
                startIcon={<Icon icon="fingerprint" />}
                onClick={() => dispatch(navigateTo( router, '/fingerprints'))}
            >  
                Fingerprints
            </Button>
        </Box>
    );
}