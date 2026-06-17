 'use client';
import * as React from 'react';
import type { T_Account } from './types';
import {
    Avatar,
    IconButton,
} from '@mui/material';
import { useDispatch } from '../../../NX/Uberedux';
import { useSupabaseAuth } from '../../../NX/Paywall';
import { initAccount, setAccount, useAccount } from '.';
import { Icon } from '../../../NX/DesignSystem';
import {AccountDialog} from '../Account';

export default function Account() {

    const { user } = useSupabaseAuth();
    const dispatch = useDispatch();
    const account = useAccount();
    const accountRows = Array.isArray(account?.data) ? account.data : [];
    const data = (accountRows[0] || null) as T_Account | null;
    const avatarSource =
        typeof data?.data === 'object' &&
        data?.data !== null &&
        typeof (data.data as Record<string, unknown>).avatar === 'string' &&
        String((data.data as Record<string, unknown>).avatar).trim()
            ? String((data.data as Record<string, unknown>).avatar).trim()
            : undefined;
    React.useEffect(() => {
        if (!account?.initted && !account?.loading && user?.id) {
            dispatch(initAccount(user.id));
        }
    }, [dispatch, account?.initted, account?.loading, user?.id]);

    const handleOpenAccount = () => {
        dispatch(setAccount('accountOpen', true));
    };

    if (account?.loading) return null;

    return (
        <>
            <IconButton
                onClick={handleOpenAccount}
                aria-label="open account"
                sx={{ p: 0.25 }}
            >
                <Avatar src={avatarSource}>
                    {!avatarSource ? <Icon icon="clients" color="primary" /> : null}
                </Avatar>
            </IconButton>

            <AccountDialog />
        </>
    );
}

