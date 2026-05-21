"use client";
import React from 'react';
import {
    IconButton,
} from '@mui/material';
import { Icon } from '../../DesignSystem';
import { useDispatch } from '../../Uberedux';
import {
    setPaywall,
    useSupabaseAuth,
} from '../../Paywall';
import { supabase } from '../../lib/supabase';

export default function SignOutBtn() {

    const dispatch = useDispatch();
    const { user: supabaseUser } = useSupabaseAuth();

    const handleSignout = async () => {
        await supabase.auth.signOut();
        dispatch(setPaywall('supabaseAuth', null));
    }

    return (
        <>
            <IconButton onClick={handleSignout} color="primary">
                <Icon icon="signout" />
            </IconButton>
        </>
    );
}
