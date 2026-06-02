'use client';
import * as React from 'react';
import { useDispatch } from '../../../NX/Uberedux';
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
        <>
            Clients
        </>
    );
}
