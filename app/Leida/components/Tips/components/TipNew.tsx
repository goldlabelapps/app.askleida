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
    FormControlLabel,
    Stack,
    Switch,
    TextField,
} from '@mui/material';
import { Icon, navigateTo } from '../../../../NX/DesignSystem';
import { useDispatch } from '../../../../NX/Uberedux';
import { useSupabaseAuth } from '../../../../NX/Paywall';
import { initTips } from '../../Tips';

type T_TipNewProps = {
    config?: unknown;
};

type T_FormState = {
    title: string;
    category: string;
    bullets: string;
    isActive: boolean;
    displayOrder: string;
};

const initialForm: T_FormState = {
    title: '',
    category: '',
    bullets: '',
    isActive: true,
    displayOrder: '',
};

const TipNew: React.FC<T_TipNewProps> = ({ config }) => {
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

    const handleToggleActive = (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setForm((current) => ({ ...current, isActive: checked }));
    };

    const handleBack = () => {
        dispatch(navigateTo(router, '/tips'));
    };

    const handleSubmit = async () => {
        const title = form.title.trim();
        const category = form.category.trim();
        const displayOrder = form.displayOrder.trim();
        const bullets = form.bullets
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);

        if (!title) {
            setError('Add a title before creating a tip.');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const response = await fetch('/api/tips', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    practitioner_id: user?.id ?? null,
                    title,
                    data: {
                        bullets,
                        category: category || null,
                        is_active: String(form.isActive),
                        is_custom: 'true',
                        display_order: displayOrder || null,
                        practitioner_id: user?.id ?? null,
                    },
                }),
            });

            const payload = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(payload?.message || `Failed to create tip (${response.status})`);
            }

            if (user?.id) {
                await dispatch(initTips(user.id));
            }
            dispatch(navigateTo(router, '/tips'));
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
                    <Icon icon="tips" color="primary" />
                </>}
                title={<Typography variant="h6">
                    New Tip
                </Typography>}  />
            <CardContent>
                <Stack spacing={2}>
                    {error ? <Alert severity="error">{error}</Alert> : null}
                    <TextField
                        variant="filled"
                        label="Title"
                        value={form.title}
                        onChange={handleChange('title')}
                        fullWidth
                        required
                    />
                    <TextField
                        variant="filled"
                        label="Category"
                        value={form.category}
                        onChange={handleChange('category')}
                        fullWidth
                    />
                    <TextField
                        variant="filled"
                        label="Bullets (one per line)"
                        value={form.bullets}
                        onChange={handleChange('bullets')}
                        multiline
                        minRows={4}
                        fullWidth
                    />
                    <TextField
                        variant="filled"
                        label="Display order"
                        value={form.displayOrder}
                        onChange={handleChange('displayOrder')}
                        fullWidth
                    />
                    <FormControlLabel
                        control={<Switch checked={form.isActive} onChange={handleToggleActive} />}
                        label="Active"
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
                    {submitting ? 'Creating...' : 'Create tip'}
                </Button>
            </CardActions>
        </Box>
    );
};

export default TipNew;
