'use client';
import * as React from 'react';
import type { T_Practitioner } from '../Practitioner/types';
import {
    Avatar,
    IconButton,
    Menu,
    MenuItem,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useDispatch } from '../../../NX/Uberedux';
import { useSupabaseAuth } from '../../../NX/Paywall';
import { initPractitioner, usePractitioner } from '../Practitioner';
import { Icon, navigateTo } from '../../../NX/DesignSystem';
import { setPaywall } from '../../../NX/Paywall';
import { supabase } from '../../../NX/lib/supabase';

export default function Practitioner() {

    const { user } = useSupabaseAuth();
    const dispatch = useDispatch();
    const router = useRouter();
    const practitioner = usePractitioner();
    const data = (practitioner?.data || null) as T_Practitioner | null;
    const avatarSource =
        typeof data?.data === 'object' &&
        data?.data !== null &&
        typeof (data.data as Record<string, unknown>).avatar === 'string' &&
        String((data.data as Record<string, unknown>).avatar).trim()
            ? String((data.data as Record<string, unknown>).avatar).trim()
            : undefined;
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(menuAnchorEl);


    React.useEffect(() => {
        if (!practitioner?.initted && !practitioner?.loading && user?.id) {
            dispatch(initPractitioner(user.id));
        }
    }, [dispatch, practitioner?.initted, practitioner?.loading, user?.id]);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setMenuAnchorEl(null);
    };

    const handleSettings = () => {
        handleCloseMenu();
        dispatch(navigateTo(router, '/practitioner'));
    };

    const handleSignout = async () => {
        handleCloseMenu();
        await supabase.auth.signOut();
        dispatch(setPaywall('supabaseAuth', null));
    };

    if (practitioner?.loading) return null;

    return (
        <>
            <IconButton
                onClick={handleOpenMenu}
                aria-label="practitioner menu"
                aria-controls={menuOpen ? 'practitioner-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={menuOpen ? 'true' : undefined}
                sx={{ p: 0.25 }}
            >
                <Avatar src={avatarSource}>
                    {!avatarSource ? <Icon icon="clients" color="primary" /> : null}
                </Avatar>
            </IconButton>

            <Menu
                id="practitioner-menu"
                anchorEl={menuAnchorEl}
                open={menuOpen}
                onClose={handleCloseMenu}
                keepMounted
            >
                <MenuItem onClick={handleSettings}>Settings</MenuItem>
                <MenuItem onClick={handleSignout}>Sign out</MenuItem>
            </Menu>
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