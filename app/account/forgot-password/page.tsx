'use client';

import * as React from 'react';
import {
    Alert,
    Box,
    Button,
    Container,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { NX } from '../../NX';
import { Editable, Wrapper } from '../../Leida';
import { supabase } from '../../NX/lib/supabase';
import { defaultTenantConfig } from '../../lib/tenantConfig/base';
import { loadTenantConfigClient } from '../../lib/tenantConfig/client';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [config, setConfig] = React.useState(defaultTenantConfig);
    const [configLoaded, setConfigLoaded] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [sending, setSending] = React.useState(false);
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

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            setError('Enter your email address.');
            return;
        }

        setSending(true);

        try {
            const redirectTo = `${window.location.origin}/account/reset-password`;
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
                redirectTo,
            });

            if (resetError) {
                setError(resetError.message);
                return;
            }

            setSuccess('Password reset email sent. Check your inbox for the reset link.');
        } finally {
            setSending(false);
        }
    };

    if (!configLoaded) {
        return null;
    }

    return (
        <NX config={config}>
            <Container maxWidth="sm" sx={{ py: 8 }}>
                <Wrapper>
                    <Stack spacing={2.5}>
                        <Box>
                            <Typography variant="h4" gutterBottom>
                                Reset password
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Enter your email and we will send you a secure link to set a new password.
                            </Typography>
                        </Box>

                        {error ? <Alert severity="error">{error}</Alert> : null}
                        {success ? <Alert severity="success">{success}</Alert> : null}

                        <Box component="form" onSubmit={handleSubmit}>
                            <Stack spacing={2}>
                                <Editable
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={setEmail}
                                    autoComplete="email"
                                />
                                <Stack direction="row" spacing={1.5}>
                                    <Button type="submit" variant="contained" disabled={sending}>
                                        {sending ? 'Sending...' : 'Send reset link'}
                                    </Button>
                                    <Button variant="outlined" onClick={() => router.push('/')}>
                                        Back to sign in
                                    </Button>
                                </Stack>
                            </Stack>
                        </Box>
                    </Stack>
                </Wrapper>
            </Container>
        </NX>
    );
}
