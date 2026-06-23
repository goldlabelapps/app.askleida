"use client";
import React from 'react';
import { 
    Box,
    type Theme,
} from '@mui/material';
// import { Icon } from '../../../NX/DesignSystem';

type T_Wrapper = {
    children: React.ReactNode;
};

const Wrapper: React.FC<T_Wrapper> = ({
    children,
}) => {
    return (
        <Box sx={{
            border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 5,
            p: 2,
            mx: 2,
            backgroundColor: (theme: Theme) => theme.palette.background.paper,
        }}>
            {children}
        </Box>
    );
};

export default Wrapper;