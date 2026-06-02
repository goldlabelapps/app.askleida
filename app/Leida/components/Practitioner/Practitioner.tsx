'use client';
import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import {
    Alert,
    Box,
    CardContent,
    CardHeader,
    Typography,
} from '@mui/material';
import { useDispatch } from '../../../NX/Uberedux';
import { useSupabaseAuth } from '../../../NX/Paywall';
// import { initPractitioner, usePractitioner } from '../Practitioner';
import { Icon } from '../../../NX/DesignSystem';


export default function Practitioner() {

    const dispatch = useDispatch();

    // React.useEffect(() => {
    //     if (!clients?.initted && !clients?.loading && user?.id) {
    //         dispatch(initClients(user.id));
    //     }
    // }, [dispatch, clients?.initted, clients?.loading, user?.id]);


    return (
            <Box>
            Practitioner
            </Box>
    );
}
