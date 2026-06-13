'use client';

import * as React from 'react';
import type { Session } from '@supabase/supabase-js';
import {
    Alert,
    Box,
    Button,
    Container,
    LinearProgress,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { NX } from '../../NX';
import { supabase } from '../../NX/lib/supabase';
import { defaultTenantConfig } from '../../lib/tenantConfig/base';
import { loadTenantConfigClient } from '../../lib/tenantConfig/client';

const MIN_PASSWORD_LENGTH = 6;

export default function ResetPasswordPage() {
    const router = useRouter();
    const [config, setConfig] = React.useState(defaultTenantConfig);
    const [configLoaded, setConfigLoaded] = React.useState(false);
    const [authChecked, setAuthChecked] = React.useState(false);
    const [hasSession, setHasSession] = React.useState(false);
    const [email, setEmail] = React.useState<string | null>(null);
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);

    React.useEffect(() => {
        let active = true;

        const loadTenantConfig = async () => {
            try {
                const tenantConfig = await loadTenantConfigClient();
                if (!active) return;
                setConfig(tenantConfig.config);
            } finally {
                if (active) {
                    setConfigLoaded(true);
                }
            }
        };

        void loadTenantConfig();

        return () => {
            active = false;
        };
    }, []);

    React.useEffect(() => {
        if (!success) return;

        const timer = window.setTimeout(() => {
            router.replace('/');
        }, 800);

        return () => window.clearTimeout(timer);
    }, [router, success]);

    React.useEffect(() => {
        let active = true;

        const applySession = (session: Session | null) => {
            if (!active) return;
            setEmail(session?.user?.email ?? null);
            setHasSession(Boolean(session?.user));
            setAuthChecked(true);
        };

        const readSession = async () => {
            const { data, error: sessionError } = await supabase.auth.getSession();
            if (!active) return;
            if (sessionError) {
                setError(sessionError.message);
            }
            applySession(data.session ?? null);
        };

        void readSession();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            applySession(session ?? null);
        });

        return () => {
            active = false;
            listener.subscription.unsubscribe();
        };
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        if (!hasSession) {
            setError('No active password reset session was found. Request a new reset link and try again.');
            return;
        }

        if (password.length < MIN_PASSWORD_LENGTH) {
            setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setSaving(true);

        try {
            const { error: updateError } = await supabase.auth.updateUser({ password });
            if (updateError) {
                setError(updateError.message);
                return;
            }
        } finally {
            setSaving(false);
        }

        setSuccess('Password updated. Redirecting to sign in...');
        setPassword('');
        setConfirmPassword('');
    };

    if (!configLoaded) {
        return null;
    }

    if (!authChecked) {
        return (
            <NX config={config}>
                <LinearProgress />
            </NX>
        );
    }

    return (
        <NX config={config}>
            <Container maxWidth="sm" sx={{ py: 8 }}>
                <Paper variant="outlined" sx={{ p: 4 }}>
                    <Stack spacing={2.5}>
                        <Box>
                            <Typography variant="h4" gutterBottom>
                                Set a new password
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Choose a new password for your account.
                            </Typography>
                        </Box>

                        {error ? <Alert severity="error">{error}</Alert> : null}
                        {success ? <Alert severity="success">{success}</Alert> : null}

                        {!hasSession ? (
                            <Stack spacing={2}>
                                <Alert severity="warning">
                                    This reset link is missing or expired. Request a new password reset email.
                                </Alert>
                                <Button variant="outlined" onClick={() => router.push('/account/forgot-password')}>
                                    Request new reset link
                                </Button>
                            </Stack>
                        ) : (
                            <Box component="form" onSubmit={handleSubmit}>
                                <Stack spacing={2}>
                                    <TextField
                                        variant="standard"
                                        label="Email"
                                        value={email || ''}
                                        disabled
                                        fullWidth
                                    />
                                    <TextField
                                        label="New password"
                                        type="password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        autoComplete="new-password"
                                        fullWidth
                                    />
                                    <TextField
                                        label="Confirm password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(event) => setConfirmPassword(event.target.value)}
                                        autoComplete="new-password"
                                        fullWidth
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        Use at least {MIN_PASSWORD_LENGTH} characters.
                                    </Typography>
                                    <Stack direction="row" spacing={1.5}>
                                        <Button type="submit" variant="contained" disabled={saving}>
                                            {saving ? 'Saving...' : 'Update password'}
                                        </Button>
                                        <Button variant="outlined" onClick={() => router.push('/')}>
                                            Back to sign in
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Box>
                        )}
                    </Stack>
                </Paper>
            </Container>
        </NX>
    );
}
