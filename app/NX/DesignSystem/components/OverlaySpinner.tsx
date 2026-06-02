import React from 'react';
import { Box, CircularProgress } from '@mui/material';

type T_OverlaySpinnerProps = {
    size?: number;
    color?: string;
};

export default function OverlaySpinner({ size = 42, color = 'currentColor' }: T_OverlaySpinnerProps) {
    return (
        <Box sx={{ position: 'relative', width: size, height: size, color }}>
            <CircularProgress
                variant="determinate"
                value={100}
                size={size}
                thickness={4.2}
                sx={{
                    color: 'rgba(255, 255, 255, 0.22)',
                    position: 'absolute',
                    inset: 0,
                }}
            />
            <CircularProgress
                size={size}
                thickness={4.2}
                sx={{
                    color: 'inherit',
                    position: 'absolute',
                    inset: 0,
                    '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                    },
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: Math.max(5, Math.floor(size * 0.12)),
                    height: Math.max(5, Math.floor(size * 0.12)),
                    borderRadius: '50%',
                    backgroundColor: 'currentColor',
                    transform: 'translate(-50%, -50%)',
                    opacity: 0.9,
                }}
            />
        </Box>
    );
}