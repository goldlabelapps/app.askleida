'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
    Box,
    Alert,
    Button,
    CardHeader,
    CircularProgress,
    LinearProgress,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material';
import { useDispatch } from '../../../NX/Uberedux';
import { Icon, navigateTo } from '../../../NX/DesignSystem';
import { useSupabaseAuth } from '../../../NX/Paywall';
import { initClients, useClients } from '../Clients';
import { ageFromDoB } from '../../../Leida';

export default function Clients() {

    const router = useRouter();
    const { user } = useSupabaseAuth();
    const dispatch = useDispatch();
    const clients = useClients();
    const list = Array.isArray(clients?.list) ? clients.list : [];
    const titleText = list.length > 0 ? `Clients (${list.length})` : 'Clients';
    
    React.useEffect(() => {
        if (!clients?.initted && !clients?.loading && user?.id) {
            dispatch(initClients(user.id));
        }
    }, [dispatch, clients?.initted, clients?.loading, user?.id]);

    const handleNew = () => {
        dispatch(navigateTo(router, '/clients/new'));
    };

    return (
        <Box>
            <CardHeader 
                avatar={<>
                    {clients?.loading ? <CircularProgress size={20} /> : 
                    <Box sx={{mt:1, ml:1}}>
                        <Icon icon="clients" color="primary" />
                    </Box>}
                </>}
                title={<Typography variant="h6">{titleText}</Typography>}
                action={<>
                    <Button
                        endIcon={<Icon icon="add" />}
                        color="primary"
                        onClick={handleNew}
                    >
                        New
                    </Button>
                </>}
            />
            
                {clients?.loading ? null : clients?.error ? (
                    <Alert severity="error">{String(clients.error)}</Alert>
                ) : (
                    <>
                        <List dense>
                            {list.map((client: any) => {
                                const firstName = client?.data?.first_name || client?.first_name || '';
                                const lastName = client?.data?.last_name || client?.last_name || '';
                                const fullName = `${firstName} ${lastName}`.trim() || 'Unnamed client';
                                const clientId = client?.client_id;
                                const dateOfBirth = client?.data?.date_of_birth || client?.date_of_birth || '';
                                const subheader = typeof dateOfBirth === 'string' && dateOfBirth.trim().length > 0
                                    ? ageFromDoB(dateOfBirth)
                                    : 'no date of birth';
                                const itemKey = String(clientId || fullName);


                                return (
                                    <ListItem key={itemKey} disablePadding>
                                        <ListItemButton
                                            disabled={!clientId}
                                            onClick={() => {
                                                if (clientId) {
                                                    dispatch(navigateTo(router, `/clients/${clientId}`));
                                                }
                                            }}
                                        >
                                            <ListItemText 
                                                primary={<Typography variant="subtitle1">
                                                            {fullName}
                                                        </Typography>} 
                                                secondary={subheader}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </>
                )}
        </Box>
    );
}
