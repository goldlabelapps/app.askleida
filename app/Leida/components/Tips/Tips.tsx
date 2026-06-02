'use client';
import * as React from 'react';
import {
    Box,
    Card,
    CardHeader,
    Typography,
} from '@mui/material';
import { Icon } from '../../../NX/DesignSystem';


export default function Tips() {
    
    return (
        <Box>
            <CardHeader 
                title={<Typography variant="h6">
                    Tips
                </Typography>}
                avatar={<>
                    <Icon icon="tips" color="primary" />
                </>}
            />
        </Box>
    );
}
