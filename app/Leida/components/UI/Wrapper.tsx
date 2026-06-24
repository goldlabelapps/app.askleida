"use client";
import React from 'react';
import { 
    Box,
    type Theme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
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
            backgroundColor: (theme: Theme) => alpha(theme.palette.background.paper, 0.8),
        }}>
            {children}
        </Box>
    );
};

export default Wrapper;