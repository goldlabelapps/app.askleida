'use client';
import * as React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Alert,
} from '@mui/material';
import { Icon } from '../../../NX/DesignSystem';

export default function Products() {
    
    return (
        <Card variant="outlined">
            <CardHeader
                title={<Typography variant="h6">
                    Products
                </Typography>}
                avatar={<>
                    <Icon icon="products" color="primary" />
                </>}
            />
            <CardContent>
                <Alert severity="success">
                    To do
                </Alert>
            </CardContent>
        </Card>
    );
}
