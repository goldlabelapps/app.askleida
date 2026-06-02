'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
    Alert,
    Avatar,
    IconButton,
    Card,
    CardHeader,
    CardContent,
    LinearProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
} from '@mui/material';
import { useDispatch } from '../../../NX/Uberedux';
import { Icon, navigateTo } from '../../../NX/DesignSystem';
import { useSupabaseAuth } from '../../../NX/Paywall';
import { initClients, useClients } from '../Clients';

export default function Clients() {

    const router = useRouter();
    const { user } = useSupabaseAuth();
    const dispatch = useDispatch();
    const clients = useClients();
    const list = Array.isArray(clients?.list) ? clients.list : [];

    React.useEffect(() => {
        if (!clients?.initted && !clients?.loading && user?.id) {
            dispatch(initClients(user.id));
        }
    }, [dispatch, clients?.initted, clients?.loading, user?.id]);

    return (
        <Card variant="outlined">
            <CardHeader 
                avatar={<>
                    <Icon icon="clients" color="primary" />
                </>}
                title={`You have ${list.length} clients`}
                subheader={`Your practitioner_id is ${user?.id ?? 'not available'}`}
                action={<>
                    <IconButton
                        
                    >
                        <Icon icon="add" />
                    </IconButton>
                </>}
            />
            <CardContent>
                {clients?.loading ? (
                    <LinearProgress />
                ) : clients?.error ? (
                    <Alert severity="error">{String(clients.error)}</Alert>
                ) : (
                    <List dense>
                        {list.map((client: any) => {
                            const firstName = client?.data?.first_name || client?.first_name || '';
                            const lastName = client?.data?.last_name || client?.last_name || '';
                            const fullName = `${firstName} ${lastName}`.trim() || 'Unnamed client';
                            const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?';
                            const clientId = client?.client_id;

                            return (
                                <ListItem key={clientId || fullName} disablePadding>
                                    <ListItemButton
                                        disabled={!clientId}
                                        onClick={() => {
                                            if (clientId) {
                                                dispatch(navigateTo(router, `/clients/${clientId}`));
                                            }
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar>{initials}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={fullName} />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                )}
            </CardContent>
        </Card>
    );
}
