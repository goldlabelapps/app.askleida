"use client";
import React from 'react';
import {
    IconButton,
} from '@mui/material';
import { Icon } from '../../DesignSystem';
import { useDispatch } from '../../Uberedux';
import {
    setPaywall,
    firebaseLogout,
    useSupabaseAuth,
} from '../../Paywall';

import { supabase } from '../../lib/supabase';

export default function SignOutBtn() {

    const dispatch = useDispatch();
    const { user: supabaseUser } = useSupabaseAuth();

    const handleSignout = async () => {
        if (supabaseUser) {
            await supabase.auth.signOut();
        } else {
            await firebaseLogout();
        }
        dispatch(setPaywall('user', null));
        dispatch(setPaywall('account', null));
    }

    return (
        <>
            <IconButton onClick={handleSignout} color="primary">
                <Icon icon="signout" />
            </IconButton>
        </>
    );
}
