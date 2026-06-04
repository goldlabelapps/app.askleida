"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import {
    Alert,
    Box,
    Button,
    Collapse,
    Fab,
    Typography,
    CardActions,
    CardContent,
    CardHeader,
    IconButton,
} from '@mui/material';
import { Icon, navigateTo } from '../../../../NX/DesignSystem';
import { useDispatch } from '../../../../NX/Uberedux';
import { BulletEditor, Editable } from '../../../../Leida';
import { createTip } from '../../Tips';
import { useSupabaseAuth } from '../../../../NX/Paywall';

type T_TipNewProps = {
    config?: unknown;
};

const TipNew: React.FC<T_TipNewProps> = ({ config }) => {
    void config;

    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useSupabaseAuth();
    const [submitting, setSubmitting] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [bullets, setBullets] = React.useState<string[]>([]);
    const [error, setError] = React.useState<string | null>(null);

    const normalizedTitle = title.trim();
    const normalizedBullets = React.useMemo(
        () => bullets.map((bullet) => bullet.trim()).filter((bullet) => bullet.length > 0),
        [bullets],
    );
    const hasTitle = normalizedTitle.length > 0;
    const hasBullets = normalizedBullets.length > 0;
    const canSave = hasTitle && hasBullets && !submitting;

    const handleTipsNavigate = () => {
        dispatch(navigateTo(router, '/tips'));
    };

    const handleBack = () => {
        dispatch(navigateTo(router, '/tips'));
    };

    const handleSave = async () => {
        if (!hasTitle) {
            setError('Title is required.');
            return;
        }

        if (!hasBullets) {
            setError('Please add at least one bullet before saving.');
            return;
        }

        if (!user?.id) {
            setError('You must be signed in to create a tip.');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const success = await dispatch(createTip({
                practitioner_id: user.id,
                title: normalizedTitle,
                data: {
                    bullets: normalizedBullets,
                },
            }));

            if (success) {
                handleTipsNavigate();
            } else {
                throw new Error('Failed to create tip');
            }
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            setError(message || 'Failed to create tip');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box>
            <CardHeader 
                avatar={<>
                    <IconButton
                        color="primary"
                        onClick={handleTipsNavigate}
                    >
                        <Icon icon="tips" />
                    </IconButton>
                </>}
                title={<Typography variant="h6">
                    New
                </Typography>}  />
            <CardContent>
                <Box sx={{ display: 'grid', gap: 2 }}>
                    {error ? <Alert severity="error">{error}</Alert> : null}
                    <Editable
                        label="Title"
                        value={title}
                        placeholder="Add title"
                        required
                        onChange={setTitle}
                    />
                    <BulletEditor
                        value={bullets}
                        onChange={setBullets}
                        disabled={submitting}
                    />
                </Box>
            </CardContent>
            <Collapse in={canSave || submitting} unmountOnExit>
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
                        disabled={submitting || !canSave}
                        onClick={handleSave}
                    >
                        <Icon icon="save" />
                    </Fab>
                </Box>
            </Collapse>
            <CardActions>
                <Button 
                    fullWidth
                    startIcon={<Icon icon="left" />}
                    variant="text" onClick={handleTipsNavigate}>
                    Back
                </Button>
            </CardActions>
        </Box>
    );
};

export default TipNew;
