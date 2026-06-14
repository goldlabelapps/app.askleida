'use client';

import * as React from 'react';
import type { Session } from '@supabase/supabase-js';
import Image from 'next/image';
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
import { supabase } from '../../NX/lib/supabase';
import { Icon,  } from '../../NX/DesignSystem';
import { NX } from '../../NX';
import { defaultTenantConfig } from '../../lib/tenantConfig/base';
import { loadTenantConfigClient } from '../../lib/tenantConfig/client';
import { sessionHasPasswordAuth, sessionRequiresInvitePasswordSetup } from '../../NX/Paywall/hooks/useSupabaseAuth';

const MIN_PASSWORD_LENGTH = 6;

export default function InvitePage() {
    const router = useRouter();
    const [config, setConfig] = React.useState(defaultTenantConfig);
    const [configLoaded, setConfigLoaded] = React.useState(false);
    const [email, setEmail] = React.useState<string | null>(null);
    const [authChecked, setAuthChecked] = React.useState(false);
    const [hasSession, setHasSession] = React.useState(false);
    const [sessionReadyForApp, setSessionReadyForApp] = React.useState(false);
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);
    const [saving, setSaving] = React.useState(false);

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
            router.replace('/?onboard=true');
        }, 800);

        return () => window.clearTimeout(timer);
    }, [router, success]);

    React.useEffect(() => {
        let active = true;

        const applySession = (session: Session | null) => {
            if (!active) return;
            setEmail(session?.user?.email ?? null);
            setHasSession(Boolean(session?.user));
            setSessionReadyForApp(Boolean(session?.user) && !sessionRequiresInvitePasswordSetup(session));
            setAuthChecked(true);
            if (session?.user) {
                setError(null);
            }
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
            setError('This invite link is missing or expired. Open the latest invite email and try again.');
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

        if (!email) {
            setError('Unable to determine the invited account email. Reopen the invite link and try again.');
            return;
        }

        setSaving(true);

        try {
            const { error: updateError } = await supabase.auth.updateUser({ password });

            if (updateError) {
                setError(updateError.message);
                return;
            }

            const { error: signOutError } = await supabase.auth.signOut();

            if (signOutError) {
                setError(signOutError.message);
                return;
            }

            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                setError(signInError.message);
                return;
            }

            if (!sessionHasPasswordAuth(signInData.session ?? null)) {
                setError('Password was saved, but the account did not establish a password login session. Sign in with your new password.');
                return;
            }
        } finally {
            setSaving(false);
        }

        setSuccess('Password set. You can continue into the app now.');
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


                <div className="signin-avatar-wrap">
                    <a href="https://askleida.com" className="logo-link">
                        <Image
                            src={`/askleida/svg/logo-dark.svg`}
                            alt="Leida"
                            width={110}
                            height={22}
                            className="logo" />
                    </a>
                </div>

                <Paper variant="outlined" sx={{ p: 4 }}>
                    <Stack spacing={2.5}>
                        <Box>
                            <Typography variant="body1" color="text.secondary">
                                Finish accepting your invite by choosing a password for your account.
                            </Typography>
                        </Box>

                        {error ? <Alert severity="error">{error}</Alert> : null}
                        {success ? <Alert severity="success">{success}</Alert> : null}

                        {authChecked && !hasSession ? (
                            <Stack spacing={2}>
                                <Alert severity="warning">
                                    No active invite session was found. Open the latest invite email, click the link again, and then set your password here.
                                </Alert>
                                <Button 
                                    endIcon={<Icon icon="signin" />}
                                    variant="contained" 
                                    onClick={() => router.push('/')}>
                                    Sign in
                                </Button>
                            </Stack>
                        ) : null}

                        {authChecked && hasSession && !sessionReadyForApp ? (
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
                                            {saving ? 'Saving...' : 'Set password'}
                                        </Button>
                                        <Button
                                            endIcon={<Icon icon="right" />}
                                            variant="text"
                                            disabled={!success}
                                            onClick={() => router.push('/?onboard=true')}
                                        >
                                            app.askleida.com
                                        </Button>
                                    </Stack>

                                </Stack>
                            </Box>
                        ) : null}

                        {authChecked && sessionReadyForApp ? (
                            <Stack spacing={2}>
                                <Alert severity="success">
                                    Your account is already confirmed. Continue into the app.
                                </Alert>
                                <Button
                                    endIcon={<Icon icon="right" />}
                                    variant="contained"
                                    onClick={() => router.push('/?onboard=true')}
                                >
                                    Continue
                                </Button>
                            </Stack>
                        ) : null}
                    </Stack>
                </Paper>
            </Container>
        </NX>
    );
}

