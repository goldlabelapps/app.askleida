'use client';
import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
} from '@mui/material';


export default function Products() {
    

    return (
        <Card variant="outlined">
            <CardHeader 
                title={<Typography variant="h6">Product recommendations coming soon...</Typography>}
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary">
                    This feature is under development. In the meantime, you can generate personalized product recommendations for your clients using the "Recommendations" tab.
                </Typography>
            </CardContent>
        </Card>
        
    );
}
