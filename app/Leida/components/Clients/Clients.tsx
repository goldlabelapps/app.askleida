'use client';
import * as React from 'react';
import { 
    IconButton,
    Card,
    CardHeader,
} from '@mui/material';
import { useDispatch } from '../../../NX/Uberedux';
import { Icon } from '../../../NX/DesignSystem';
import { initClients, useClients } from '../Clients';

export default function Clients() {

    const dispatch = useDispatch();
    const clients = useClients();

    React.useEffect(() => {
        if (!clients?.initted) {
            dispatch(initClients());
        }
    }, [dispatch, clients?.initted]);

    return (
        <Card variant="outlined">
            <CardHeader 
                avatar={<>
                    <Icon icon="clients" color="primary" />
                </>}
                title="You have X clients"
                subheader="Manage your clients effectively" 
                action={<>
                    <IconButton
                        
                    >
                        <Icon icon="add" />
                    </IconButton>
                </>}
            />
        </Card>
    );
}
