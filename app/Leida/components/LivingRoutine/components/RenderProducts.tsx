import React from 'react';
import { Box, Typography } from '@mui/material';

type Product = {
    name: string;
    cadence: string;
};

type RenderProductsProps = {
    products: Product[];
};

const RenderProducts: React.FC<RenderProductsProps> = ({ products }) => {
    const productsDebug = JSON.stringify(products, null, 2);

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
            <Typography variant="h6" sx={{ my: 2 }}>
                Products
            </Typography>

            <Box
                component="pre"
                sx={{
                    m: 0,
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: 'grey.100',
                    color: 'text.primary',
                    fontSize: 12,
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                }}
            >
                {productsDebug}
            </Box>
        </Box>
    );
};

export default RenderProducts;
