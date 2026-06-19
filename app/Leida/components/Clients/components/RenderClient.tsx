"use client";
import React from 'react';
import type { T_Client } from '../../../types';
import { 
    CircularProgress,
    Card,
    CardContent,
    Box,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';
import { Icon, ConfirmAction } from '../../../../NX/DesignSystem';
import { useDispatch } from '../../../../NX/Uberedux';
import {
    deleteClient,
} from '../../../../Leida';

export type I_RenderClient = {
    client: T_Client;
    mode?: 'list' | 'detail' | 'card';
};

const RenderClient: React.FC<I_RenderClient> = ({ 
    client,
    mode = 'list',
}) => {
    const dispatch = useDispatch();
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const clientData = client?.data && typeof client.data === 'object' && !Array.isArray(client.data)
        ? client.data as Record<string, unknown>
        : {};
    const firstName = typeof clientData.first_name === 'string' ? clientData.first_name.trim() : '';
    const lastName = typeof clientData.last_name === 'string' ? clientData.last_name.trim() : '';
    const fullName = [firstName, lastName].filter(Boolean).join(' ');
    const title = fullName || (typeof client.title === 'string' ? client.title.trim() : '') || 'Unnamed client';
    const email = typeof clientData.email === 'string' ? clientData.email.trim() : '';
    const clientId = typeof client.client_id === 'string'
        ? client.client_id.trim()
        : typeof client.id === 'string'
            ? client.id.trim()
            : '';

    const handleOpenDeleteConfirm = () => {
        setConfirmOpen(true);
    };

    const handleCloseDeleteConfirm = () => {
        setConfirmOpen(false);
    };

    const handleDelete = async () => {
        if (!clientId) {
            setConfirmOpen(false);
            return;
        }

        setConfirmOpen(false);
        setIsDeleting(true);
        try {
            await dispatch(deleteClient(clientId));
        } finally {
            setIsDeleting(false);
        }
    };

    if (mode === 'list') {
        return (<>
            <>
                {isDeleting ? (
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'rgba(255, 255, 255, 0.7)',
                            zIndex: 1,
                        }}
                    >
                        <CircularProgress size={24} />
                    </Box>
                ) : null}
                <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                        <Box>
                            <Typography variant="body1">{title}</Typography>
                            {/* {email ? (
                                <Typography variant="body2" color="text.secondary">{email}</Typography>
                            ) : null} */}
                        </Box>

                        <IconButton
                            color="primary"
                            aria-label={`Delete ${title}`}
                            onClick={handleOpenDeleteConfirm}
                            disabled={!clientId || isDeleting}
                        >
                            <Icon icon="delete" />
                        </IconButton>
                    </Stack>
                </CardContent>
                {/* <pre>client: {JSON.stringify(client, null, 2)}</pre> */}
            </>

            <ConfirmAction
                open={confirmOpen}
                icon="delete"
                title="Delete Client?"
                body="Are you sure you want to delete this client? This action cannot be undone."
                handleConfirm={handleDelete}
                handleClose={handleCloseDeleteConfirm}
            />
        </>);
    }
    
    return (<>
        <Box sx={{ border: '1px solid green', p: 1, my: 1 }}>
            <pre>client: {JSON.stringify(client, null, 2)}</pre>
        </Box>
    </>);
};

export default RenderClient;