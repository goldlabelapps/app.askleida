'use client';
import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
} from '@mui/material';


export default function Tips() {
    

    return (
        <Card variant="outlined">
            <CardHeader 
                title={<Typography variant="h6">Tips coming soon...</Typography>}
            />
        </Card>
        
    );
}
