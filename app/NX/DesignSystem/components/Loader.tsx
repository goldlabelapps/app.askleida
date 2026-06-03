'use client';
import * as React from 'react';
import { Backdrop } from '@mui/material';
import { useDesignSystem, setDesignSystem } from '../../DesignSystem';
import { useDispatch } from '../../Uberedux';
import OverlaySpinner from './OverlaySpinner';

export default function Loader() {
    const designSystem = useDesignSystem();
    const loading = designSystem?.loading;
    const dispatch = useDispatch();

    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    const handleClose = () => {
        dispatch(setDesignSystem('loading', false));
    };

    React.useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape' && loading) {
                handleClose();
            }
        }
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [loading]);

    if (!mounted) return null;

    return (
        <Backdrop 
            open={!!loading} 
            sx={{ 
                zIndex: (theme) => theme.zIndex.drawer + 2000,
                color: '#eef3ff',
                backgroundColor: 'rgba(8, 13, 24, 0.34)',
                backdropFilter: 'blur(2px)',
            }}>
            <OverlaySpinner />
        </Backdrop>
    );
}
