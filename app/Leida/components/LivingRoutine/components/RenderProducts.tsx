import React from 'react';
import {
    Box,
    Skeleton,
    Typography,
} from '@mui/material';

const RenderProducts = () => {
    return (
        <Box
            sx={{
                mb: 3,
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
            }}
        >
            <Skeleton variant="rounded" height={190} sx={{ mb: 1.5 }} />
            <Skeleton variant="rounded" width={120} height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={34} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" height={24} />
            <Skeleton variant="text" height={24} width="80%" sx={{ mb: 1.5 }} />
            <Skeleton variant="rounded" height={40} />
        </Box>
    );
};

export default RenderProducts;
