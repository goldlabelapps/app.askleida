"use client";
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Alert,
    Box,
    Button,
    CardActions,
    CardContent,
    CardHeader,
    Collapse,
    Fab,
    Grid,
    Stack,
    Typography,
} from '@mui/material';
import { Icon, navigateTo } from '../../../../NX/DesignSystem';
import { useDispatch } from '../../../../NX/Uberedux';
import { useSupabaseAuth } from '../../../../NX/Paywall';
import { Editable } from '../../../../Leida';
import { createRecommendation } from '../actions/createRecommendation';
import { initClients, useClients } from '../../Clients';

type T_RecommendationNewProps = {
    config?: unknown;
};

type T_FormState = {
    title: string;
    client_id: string;
    client_name: string;
    therapist_context: string;
    tips: string;
    draft: string;
    export_url: string;
};

const initialForm: T_FormState = {
    title: '',
    client_id: '',
    client_name: '',
    therapist_context: '',
    tips: '',
    draft: '',
    export_url: '',
};

const getStringValue = (value: unknown): string => {
    if (typeof value !== 'string') {
        return '';
    }

    return value.trim();
};

const getClientFullName = (client: any) => {
    const firstName = client?.data?.first_name || client?.first_name || '';
    const lastName = client?.data?.last_name || client?.last_name || '';
    return `${firstName} ${lastName}`.trim() || client?.title || 'Unnamed client';
};

const RecommendationNew: React.FC<T_RecommendationNewProps> = ({ config }) => {
    void config;

    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useSupabaseAuth();
    const searchParams = useSearchParams();
    const clients = useClients();
    const list = Array.isArray(clients?.list) ? clients.list : [];
    const initialClientId = searchParams.get('clientId') || '';
    const [form, setForm] = React.useState<T_FormState>(initialForm);
    const [error, setError] = React.useState<string | null>(null);
    const [submitting, setSubmitting] = React.useState(false);

    React.useEffect(() => {
        if (!clients?.initted && !clients?.loading && user?.id) {
            dispatch(initClients(user.id));
        }
    }, [dispatch, clients?.initted, clients?.loading, user?.id]);

    const selectedClient = React.useMemo(() => {
        if (!initialClientId) {
            return null;
        }

        return list.find((client: any) => client?.client_id === initialClientId) || null;
    }, [initialClientId, list]);

    React.useEffect(() => {
        if (!selectedClient) {
            return;
        }

        const nextClientId = getStringValue(selectedClient?.client_id || selectedClient?.id);
        const nextClientName = getClientFullName(selectedClient);

        setForm((current) => ({
            ...current,
            client_id: current.client_id || nextClientId,
            client_name: current.client_name || nextClientName,
        }));
    }, [selectedClient]);

    const hasRequiredFields = form.title.trim().length > 0 || form.client_name.trim().length > 0;

    const handleChange = (key: keyof T_FormState) => (value: string) => {
        setForm((current) => ({ ...current, [key]: value }));
    };

    const handleBack = () => {
        dispatch(navigateTo(router, '/recommendations'));
    };

    const handleSubmit = async () => {
        const title = form.title.trim();
        const clientName = form.client_name.trim();

        if (!title && !clientName) {
            setError('Add a title or client name before saving.');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const newRecommendationId = await dispatch(createRecommendation({
                practitioner_id: user?.id ?? null,
                title: title || clientName || 'New recommendation',
                data: {
                    client_id: form.client_id.trim() || null,
                    client_name: clientName || null,
                    therapist_context: form.therapist_context.trim() || null,
                    tips: form.tips.trim() || null,
                    draft: form.draft.trim() || null,
                    export_url: form.export_url.trim() || null,
                },
            }));

            dispatch(navigateTo(router, newRecommendationId ? `/recommendations/${newRecommendationId}` : '/recommendations'));
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box>
            <CardHeader
                avatar={<Icon icon="recommendation" color="primary" />}
                title={<Typography variant="h6">New Recommendation</Typography>}
            />
            <CardContent>
                <Stack spacing={2}>
                    {error ? <Alert severity="error">{error}</Alert> : null}

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <Editable variant="outlined" label="Title" value={form.title} onChange={handleChange('title')} required autoFocus />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Editable variant="outlined" label="Client ID" value={form.client_id} onChange={handleChange('client_id')} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Editable variant="outlined" label="Client name" value={form.client_name} onChange={handleChange('client_name')} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Editable variant="outlined" label="Therapist context" value={form.therapist_context} onChange={handleChange('therapist_context')} multiline minRows={3} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Editable variant="outlined" label="Tips" value={form.tips} onChange={handleChange('tips')} multiline minRows={3} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Editable variant="outlined" label="Draft" value={form.draft} onChange={handleChange('draft')} multiline minRows={8} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Editable variant="outlined" label="Export URL" value={form.export_url} onChange={handleChange('export_url')} />
                        </Grid>
                    </Grid>
                </Stack>
            </CardContent>
            <Collapse in={hasRequiredFields || submitting} unmountOnExit>
                <Box sx={{ position: 'fixed', right: { xs: 16, sm: 24 }, bottom: { xs: 16, sm: 24 }, zIndex: (theme) => theme.zIndex.appBar + 1 }}>
                    <Fab color="primary" disabled={submitting} onClick={handleSubmit}>
                        <Icon icon="save" />
                    </Fab>
                </Box>
            </Collapse>
            <CardActions>
                <Button fullWidth startIcon={<Icon icon="left" />} variant="text" onClick={handleBack}>
                    Back
                </Button>
            </CardActions>
        </Box>
    );
};

export default RecommendationNew;
