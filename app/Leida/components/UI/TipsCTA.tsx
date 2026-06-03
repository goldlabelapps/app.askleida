'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { navigateTo } from '../../../NX/DesignSystem';
import { useDispatch } from '../../../NX/Uberedux';

const TipsCTA: React.FC = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleClick = React.useCallback(() => {
        dispatch(navigateTo(router, '/tips'));
    }, [dispatch, router]);

    return (
        <Card variant="outlined" sx={{ width: '100%' }}>
            <CardActionArea onClick={handleClick} aria-label="Manage tips">
                <CardContent>
                    <Typography variant="overline" color="text.secondary">
};

export default TipsCTA;