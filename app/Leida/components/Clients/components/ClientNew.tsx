"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Grid,
    Alert,
    Button,
    IconButton,
    Collapse,
    Fab,
    Typography,
    CardActions,
    CardContent,
    CardHeader,
    Stack,
    Paper,
} from '@mui/material';
import { Icon, navigateTo } from '../../../../NX/DesignSystem';
import { useDispatch } from '../../../../NX/Uberedux';
import { useSupabaseAuth } from '../../../../NX/Paywall';
import { Editable } from '../../../../Leida';
import { createClient } from '../../Clients';

type T_ClientNewProps = {
    config?: unknown;
};

type T_FormState = {
    name: string;
    email: string;
};

const initialForm: T_FormState = {
    name: '',
    email: '',
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
    const { user } = useSupabaseAuth();
    const [form, setForm] = React.useState<T_FormState>(initialForm);
    const [error, setError] = React.useState<string | null>(null);
    const [submitting, setSubmitting] = React.useState(false);
    const hasRequiredFields =
        form.name.trim().length > 0
        && form.email.trim().length > 0;
    const isEmailReady = isValidEmail(form.email);
    const isFormComplete =
        hasRequiredFields
        && isEmailReady;

    const handleChange =
        (key: keyof T_FormState) =>
            (value: string) => {
                setForm((current) => ({ ...current, [key]: value }));
            };

    const handleBack = () => {
        dispatch(navigateTo(router, '/clients'));
    };

    const handleSubmit = async () => {
        const name = form.name.trim();
        const email = form.email.trim().toLowerCase();

        if (!name || !email) {
            setError('Name and email are required.');
            return;
        }

        if (!isValidEmail(email)) {
            setError('Email must be a valid email address.');
            return;
        }
        try {
            setSubmitting(true);
            setError(null);

            const newClientId = await dispatch(createClient({
                practitioner_id: user?.id ?? null,
                title: name || null,
                display_name: name || null,
                email: email || null,
                data: {
                    display_name: name || null,
                    email: email || null,
                },
            }));

            dispatch(navigateTo(router, newClientId ? `/clients/${newClientId}` : '/clients'));
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Paper sx={{  }}>
            <CardHeader 
                avatar={<>
                    <Box>
                        <IconButton
                            color="primary"
                            onClick={handleBack}
                        >
                            <Icon icon="left" />
                        </IconButton>
                    </Box>
                    <Box sx={{m: 1}}>
                        <Icon icon="clients" color="primary" />
                    </Box>
                </>}
                title={<Typography variant="h6">
                    Create Client
                </Typography>}  />
            <CardContent>
                <Stack spacing={2}>
                    {error ? <Alert severity="error">{error}</Alert> : null}
                    
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <Editable
                                autoFocus
                                variant="standard"
                                label="Email"
                                value={form.email}
                                onChange={handleChange('email')}
                                required
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <Editable
                                variant="standard"
                                label="Name"
                                value={form.name}
                                onChange={handleChange('name')}
                                required
                                
                            />
                        </Grid>
                        
                        
                    </Grid>
                    
                </Stack>

            </CardContent>
            <Collapse in={isFormComplete || submitting} unmountOnExit>
                <Box
                    sx={{
                        position: 'fixed',
                        right: { xs: 16, sm: 24 },
                        bottom: { xs: 16, sm: 24 },
                        zIndex: (theme) => theme.zIndex.appBar + 1,
                    }}
                >
                    <Fab
                        color="primary"
                        disabled={submitting}
                        onClick={handleSubmit}
                    >
                        <Icon icon="save" />
                    </Fab>
                </Box>
            </Collapse>
        </Paper>
    );
};

export default ClientNew;
