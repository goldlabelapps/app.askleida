"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Alert,
    Button,
    Typography,
    CardActions,
    CardContent,
    CardHeader,
    Stack,
    TextField,
} from '@mui/material';
import { Icon, navigateTo } from '../../../../NX/DesignSystem';
import { useDispatch } from '../../../../NX/Uberedux';
import { useSupabaseAuth } from '../../../../NX/Paywall';
import { initClients } from '../../Clients';

type T_ClientNewProps = {
    config?: unknown;
};

type T_FormState = {
    first_name: string;
    last_name: string;
    email: string;
};

const initialForm: T_FormState = {
    first_name: '',
    last_name: '',
    email: '',
};

const ClientNew: React.FC<T_ClientNewProps> = ({ config }) => {
    void config;

    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useSupabaseAuth();
    const [form, setForm] = React.useState<T_FormState>(initialForm);
    const [error, setError] = React.useState<string | null>(null);
    const [submitting, setSubmitting] = React.useState(false);

    const handleChange =
        (key: keyof T_FormState) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setForm((current) => ({ ...current, [key]: event.target.value }));
            };

    const handleBack = () => {
        dispatch(navigateTo(router, '/clients'));
    };

    const handleSubmit = async () => {
        const firstName = form.first_name.trim();
        const lastName = form.last_name.trim();
        const email = form.email.trim().toLowerCase();

        if (!firstName && !lastName && !email) {
            setError('Add at least a name or email before creating a client.');
            return;
        }
        try {
            setSubmitting(true);
            setError(null);

            const response = await fetch('/api/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    practitioner_id: user?.id ?? null,
                    title: [firstName, lastName].filter(Boolean).join(' ') || email || 'New client',
                    first_name: firstName || null,
                    last_name: lastName || null,
                    email: email || null,
                    data: {
                        first_name: firstName || null,
                        last_name: lastName || null,
                        email: email || null,
                    },
                }),
            });

            const payload = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(payload?.message || `Failed to create client (${response.status})`);
            }

            if (user?.id) {
                await dispatch(initClients(user.id));
            }
            dispatch(navigateTo(router, '/clients'));
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box>
            <CardHeader 
                avatar={<>
                    <Icon icon="clients" color="primary" />
                </>}
                title={<Typography variant="h6">
                    New Client
                </Typography>}  />
            <CardContent>
                <Stack spacing={2}>
                    {error ? <Alert severity="error">{error}</Alert> : null}
                    <TextField
                        variant="filled"
                        label="First name"
                        value={form.first_name}
                        onChange={handleChange('first_name')}
                        fullWidth
                    />
                    <TextField
                        variant="filled"
                        label="Last name"
                        value={form.last_name}
                        onChange={handleChange('last_name')}
                        fullWidth
                    />
                    <TextField
                        variant="filled"
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={handleChange('email')}
                        fullWidth
                    />
                </Stack>
            </CardContent>
            <CardActions>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    startIcon={<Icon icon="cancel" />}
                    onClick={handleBack} disabled={submitting}>
                    Cancel
                </Button>
                <Button 
                    startIcon={<Icon icon="save" />}
                    variant="contained" 
                    onClick={handleSubmit} disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create client'}
                </Button>
            </CardActions>
        </Box>
    );
};

export default ClientNew;
