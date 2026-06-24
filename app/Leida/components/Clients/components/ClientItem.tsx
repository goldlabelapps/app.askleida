"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import type { T_Client } from '../../../types';
import {
    CircularProgress,
    Card,
    CardContent,
    Box,
    IconButton,
    Stack,
    Typography,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Divider,
} from '@mui/material';
import { Icon, ConfirmAction, navigateTo } from '../../../../NX/DesignSystem';
import { useDispatch } from '../../../../NX/Uberedux';
import {
    deleteClient,
} from '../../../../Leida';

export type I_ClientItem = {
    client: T_Client;
    mode?: 'list' | 'detail' | 'card' | 'list-v1';
};

const ClientItem: React.FC<I_ClientItem> = ({
    client,
    mode = 'list',
}) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const clientData = client?.data && typeof client.data === 'object' && !Array.isArray(client.data)
        ? client.data as Record<string, unknown>
        : {};
    const displayName = typeof clientData.display_name === 'string' ? clientData.display_name.trim() : '';
    const title = displayName || (typeof client.title === 'string' ? client.title.trim() : 'Unnamed client');
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
        const handleClick = () => {
            if (clientId) {
                dispatch(navigateTo(router, `/clients/${clientId}`));
            }
        };

        return <>
            <ListItemButton onClick={handleClick}>
                <ListItemText
                    primary={title}
                    // secondary={clientId ? `${clientId}` : undefined}
                />
                {/* <ListItemIcon>
                    <Icon icon="right" />
                </ListItemIcon> */}
            </ListItemButton>
            <Divider component="li" />
            {/* <pre>client: {JSON.stringify(client, null, 2)}</pre> */}
        </>;
    }

    if (mode === 'list-v1') {
        return (<>
            <Card>
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

                        {/* <IconButton
                            color="primary"
                            aria-label={`Delete ${title}`}
                            onClick={handleOpenDeleteConfirm}
                            disabled={!clientId || isDeleting}
                        >
                            <Icon icon="delete" />
                        </IconButton> */}
                    </Stack>
                </CardContent>
                {/* <pre>client: {JSON.stringify(client, null, 2)}</pre> */}
            </Card>

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

export default ClientItem;
