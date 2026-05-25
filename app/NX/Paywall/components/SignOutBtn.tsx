"use client";
import React from 'react';
import {
    IconButton,
    Tooltip,
} from '@mui/material';
import { Icon, ConfirmAction } from '../../DesignSystem';
import { useDispatch } from '../../Uberedux';
import {
    setPaywall,
    useSupabaseAuth,
} from '../../Paywall';
import { supabase } from '../../lib/supabase';

export default function SignOutBtn() {
    const dispatch = useDispatch();
    const { user: supabaseUser } = useSupabaseAuth();
    const [open, setOpen] = React.useState(false);

    const handleSignout = async () => {
        await supabase.auth.signOut();
        dispatch(setPaywall('supabaseAuth', null));
        setOpen(false);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Tooltip title="Sign out">
                <IconButton onClick={handleOpen} color="primary">
                    <Icon icon="signout" />
                </IconButton>
            </Tooltip>
            <ConfirmAction
                open={open}
                icon="signout"
                title="Sign out?"
                body="Are you sure you want to sign out?"
                handleConfirm={handleSignout}
                handleClose={handleClose}
            />
        </>
    );
}
