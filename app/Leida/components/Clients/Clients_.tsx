'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
    Box,
    Alert,
    Button,
    CardHeader,
    CircularProgress,
    List,
    Typography,
    Paper,
    Fab,
} from '@mui/material';
import { useDispatch } from '../../../NX/Uberedux';
import { Icon, navigateTo } from '../../../NX/DesignSystem';
import { useSupabaseAuth } from '../../../NX/Paywall';
import { initClients, useClients } from '../Clients';
import ClientCard from './components/ClientCard';

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
                    <Box sx={{}}>
                        <Icon icon="clients" color="primary" />
                    </Box>}
                </>}
                title={<Typography variant="h6">{titleText}</Typography>}
                action={<>
                    <Fab
                        color="primary"
                        onClick={handleNew}
                    >
                        <Icon icon="add" />
                    </Fab>
                </>}
            />
            {clients?.loading ? null : clients?.error ? (
                <Alert severity="error">{String(clients.error)}</Alert>
            ) : (
                <>
                {list.map((client: any) => {
                    const itemKey = String(client?.client_id || client?.id || JSON.stringify(client));
                    return (
                        <ClientCard
                            key={itemKey}
                            client={client}
                            onClick={(clientId) => {
                                dispatch(navigateTo(router, `/clients/${clientId}`));
                            }}
                        />
                    );
                })}
                </>
            )}
        </Box>
    );
}
