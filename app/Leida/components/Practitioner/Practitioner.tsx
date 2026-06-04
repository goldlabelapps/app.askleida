'use client';
import * as React from 'react';
import type { T_Practitioner } from '../Practitioner/types';
import {
    Avatar,
    IconButton,
} from '@mui/material';
import { useDispatch } from '../../../NX/Uberedux';
import { useSupabaseAuth } from '../../../NX/Paywall';
import { initPractitioner, setPractitioner, usePractitioner } from '../Practitioner';
import { Icon } from '../../../NX/DesignSystem';
import Account from './components/Account';

export default function Practitioner() {

    const { user } = useSupabaseAuth();
    const dispatch = useDispatch();
    const practitioner = usePractitioner();
    const data = (practitioner?.data || null) as T_Practitioner | null;
    const avatarSource =
        typeof data?.data === 'object' &&
        data?.data !== null &&
        typeof (data.data as Record<string, unknown>).avatar === 'string' &&
        String((data.data as Record<string, unknown>).avatar).trim()
            ? String((data.data as Record<string, unknown>).avatar).trim()
            : undefined;
    React.useEffect(() => {
        if (!practitioner?.initted && !practitioner?.loading && user?.id) {
            dispatch(initPractitioner(user.id));
        }
    }, [dispatch, practitioner?.initted, practitioner?.loading, user?.id]);

    const handleOpenAccount = () => {
        dispatch(setPractitioner('accountOpen', true));
    };

    if (practitioner?.loading) return null;

    return (
        <>
            <IconButton
                onClick={handleOpenAccount}
                aria-label="open practitioner account"
                sx={{ p: 0.25 }}
            >
                <Avatar src={avatarSource}>
                    {!avatarSource ? <Icon icon="clients" color="primary" /> : null}
                </Avatar>
            </IconButton>

            <Account />
        </>
    );
}

/*
        <Box>
            <CardHeader
                avatar={<Icon icon="clients" color="primary" />}
                title={<Typography variant="h6">Practitioner</Typography>}
            />

            {practitioner?.loading ? (
                <LinearProgress />
            ) : practitioner?.error ? (
                <Alert severity="error">{String(practitioner.error)}</Alert>
            ) : data ? (
                <Typography variant="body1">{String(data?.display_name || data?.title || 'Practitioner loaded')}</Typography>
            ) : (
                <Alert severity="info">No practitioner found.</Alert>
            )}
        </Box>
*/