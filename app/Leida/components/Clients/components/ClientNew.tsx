"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
} from '@mui/material';
import { Icon, navigateTo } from '../../../../NX/DesignSystem';
import { useDispatch } from '../../../../NX/Uberedux';
import { useSupabaseAuth } from '../../../../NX/Paywall';
import { Editable } from '../../../../Leida';
import { createClient } from '../../Clients';

type T_ClientNewProps = {
    config?: unknown;
};

const isValidEmail = (value: string): boolean => {
    const email = value.trim();
    if (!email) {
        return false;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const ClientNew: React.FC<T_ClientNewProps> = ({ config }) => {
    void config;

    const router = useRouter();
    const dispatch = useDispatch();

    return (
        <>
            ClientNew
        </>
    );
};

export default ClientNew;
