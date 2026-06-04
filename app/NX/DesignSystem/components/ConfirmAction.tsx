'use client';
import * as React from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material';
import type { I_Icon } from '../../types';
import { Icon } from '../../DesignSystem';

export interface I_ConfirmAction {
    open: boolean;
    icon?: I_Icon['icon'];
    title: React.ReactNode;
    body: React.ReactNode;
    handleConfirm: () => void | Promise<void>;
    handleClose: () => void;
}

export default function ConfirmAction({
    open,
    icon,
    title,
    body,
    handleConfirm,
    handleClose,
}: I_ConfirmAction) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    React.useEffect(() => {
        if (!open) {
            setIsSubmitting(false);
        }
    }, [open]);

    const onConfirm = async () => {
        if (isSubmitting) {
            return;
        }

        try {
            setIsSubmitting(true);
            await Promise.resolve(handleConfirm());
        } finally {
            setIsSubmitting(false);
        }
    };

    const onClose = () => {
        if (isSubmitting) {
            return;
        }
        handleClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    
                    {icon ? <Box sx={{mr:2, mt:1}}>
                        <Icon icon={icon} />
                    </Box> : null}
                    
                    <Typography variant="h6" component="span">
                        {title}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Typography variant="body1">
                    {body}
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button 
                    startIcon={<Icon icon="close" />}
                    onClick={onClose} 
                    color="inherit" 
                    disabled={isSubmitting}>
                    No
                </Button>
                <Button 
                    endIcon={<Icon icon="tick" />}
                    onClick={onConfirm} 
                    variant="contained" 
                    color="primary" disabled={isSubmitting}>
                    {isSubmitting ? <CircularProgress size={14} color="inherit" sx={{ mr: 1 }} /> : null}
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
}
