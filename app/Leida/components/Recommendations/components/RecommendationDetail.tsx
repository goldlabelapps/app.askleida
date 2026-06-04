"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
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
import { useDispatch } from '../../../../NX/Uberedux';
import { Icon, navigateTo, ConfirmAction } from '../../../../NX/DesignSystem';
import { Editable } from '../../../../Leida';
import type { T_Recommendation } from '../types';
import { deleteRecommendation } from '../actions/deleteRecommendation';
import { patchRecommendation } from '../actions/patchRecommendation';

type T_RecommendationRecord = T_Recommendation & {
    recommendation_id?: string | null;
    title?: string | null;
    created?: string | null;
    updated?: string | null;
    data?: T_Recommendation['data'] | null;
};

type T_RecommendationDetailProps = {
    config?: unknown;
    recommendation?: T_RecommendationRecord | null;
};

const getStringValue = (value: unknown): string | null => {
    if (typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim();
    return trimmed ? trimmed : null;
};

const getDataObject = (value: unknown): Record<string, unknown> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    return value as Record<string, unknown>;
};

const cloneRecommendation = (value: T_RecommendationRecord | null | undefined): T_RecommendationRecord | null => {
    if (!value) {
        return null;
    }

    return JSON.parse(JSON.stringify(value)) as T_RecommendationRecord;
};

const areRecommendationsEqual = (left: T_RecommendationRecord | null, right: T_RecommendationRecord | null): boolean => {
    if (!left && !right) {
        return true;
    }

    if (!left || !right) {
        return false;
    }

    return JSON.stringify(left) === JSON.stringify(right);
};

const RecommendationDetail: React.FC<T_RecommendationDetailProps> = ({ config, recommendation }) => {
    void config;

    const router = useRouter();
    const dispatch = useDispatch();
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [isPatching, setIsPatching] = React.useState(false);
    const [originalRecommendation, setOriginalRecommendation] = React.useState<T_RecommendationRecord | null>(cloneRecommendation(recommendation));
    const [draftRecommendation, setDraftRecommendation] = React.useState<T_RecommendationRecord | null>(cloneRecommendation(recommendation));

    React.useEffect(() => {
        const nextRecommendation = cloneRecommendation(recommendation);
        setOriginalRecommendation(nextRecommendation);
        setDraftRecommendation(nextRecommendation);
    }, [recommendation]);

    const isDirty = !areRecommendationsEqual(originalRecommendation, draftRecommendation);
    const activeRecommendation = draftRecommendation ?? recommendation ?? null;
    const recommendationData = getDataObject(activeRecommendation?.data);
    const recommendationId = getStringValue(activeRecommendation?.recommendation_id) || getStringValue(activeRecommendation?.id);
    const title = getStringValue(activeRecommendation?.title) || 'Untitled recommendation';
    const clientName = getStringValue(recommendationData.client_name) || '';
    const clientId = getStringValue(recommendationData.client_id) || '';
    const therapistContext = getStringValue(recommendationData.therapist_context) || '';
    const tips = getStringValue(recommendationData.tips) || '';
    const draft = getStringValue(recommendationData.draft) || '';
    const exportUrl = getStringValue(recommendationData.export_url) || '';

    if (!activeRecommendation) {
        if (isDeleting) {
            return null;
        }
        return null;
    }

    const handleRecommendationsNavigate = () => {
        dispatch(navigateTo(router, '/recommendations'));
    };

    const handleNew = () => {
        dispatch(navigateTo(router, '/recommendations/new'));
    };

    const handleOpenDeleteConfirm = () => setConfirmOpen(true);
    const handleCloseDeleteConfirm = () => setConfirmOpen(false);

    const handleDelete = async () => {
        if (!recommendationId) {
            setConfirmOpen(false);
            return;
        }

        setIsDeleting(true);
        setConfirmOpen(false);
        await dispatch(deleteRecommendation(recommendationId));
        handleRecommendationsNavigate();
    };

    const handlePatch = async () => {
        if (!draftRecommendation || !recommendationId || !isDirty || isPatching) {
            return;
        }

        const draftData = getDataObject(draftRecommendation.data);
        const nextTitle = getStringValue(draftRecommendation.title) || getStringValue(draftData.client_name) || 'Recommendation';

        setIsPatching(true);
        const success = await dispatch(patchRecommendation(recommendationId, {
            title: nextTitle,
            data: {
                ...draftData,
                client_id: getStringValue(draftData.client_id) || null,
                client_name: getStringValue(draftData.client_name) || null,
                therapist_context: getStringValue(draftData.therapist_context) || null,
                tips: getStringValue(draftData.tips) || null,
                draft: getStringValue(draftData.draft) || null,
                export_url: getStringValue(draftData.export_url) || null,
            },
        }));
        setIsPatching(false);

        if (success) {
            handleRecommendationsNavigate();
        }
    };

    const handleDataChange = (key: string, nextValue: string) => {
        setDraftRecommendation((currentRecommendation) => {
            if (!currentRecommendation) {
                return currentRecommendation;
            }

            const currentData = getDataObject(currentRecommendation.data);

            return {
                ...currentRecommendation,
                data: {
                    ...currentData,
                    [key]: nextValue,
                },
            };
        });
    };

    const handleTitleChange = (nextValue: string) => {
        setDraftRecommendation((currentRecommendation) => {
            if (!currentRecommendation) {
                return currentRecommendation;
            }

            return {
                ...currentRecommendation,
                title: nextValue,
            };
        });
    };

    return (
        <>
            <Box>
                <Collapse in={isDirty} unmountOnExit>
                    <Box sx={{ position: 'fixed', right: { xs: 16, sm: 24 }, bottom: { xs: 16, sm: 24 }, zIndex: (theme) => theme.zIndex.appBar + 1 }}>
                        <Fab color="primary" disabled={isPatching} onClick={handlePatch}>
                            <Icon icon="save" />
                        </Fab>
                    </Box>
                </Collapse>

                <CardHeader
                    avatar={<Box sx={{ mt: 1, ml: 1 }}><Icon icon="recommendation" color="primary" /></Box>}
                    title={<Typography variant="h6">{title}</Typography>}
                    action={<Button startIcon={<Icon icon="add" />} onClick={handleNew}>New</Button>}
                />

                <CardContent>
                    <Stack spacing={2}>
                        <Alert severity="info">
                            Edit the recommendation record below. The generated draft is stored with the record so it can be reviewed later.
                        </Alert>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <Editable variant="outlined" label="Title" value={getStringValue(draftRecommendation?.title) || ''} onChange={handleTitleChange} required autoFocus />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Editable variant="outlined" label="Client ID" value={clientId} onChange={(value) => handleDataChange('client_id', value)} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Editable variant="outlined" label="Client name" value={clientName} onChange={(value) => handleDataChange('client_name', value)} />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Editable variant="outlined" label="Therapist context" value={therapistContext} onChange={(value) => handleDataChange('therapist_context', value)} multiline minRows={3} />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Editable variant="outlined" label="Tips" value={tips} onChange={(value) => handleDataChange('tips', value)} multiline minRows={3} />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Editable variant="outlined" label="Draft" value={draft} onChange={(value) => handleDataChange('draft', value)} multiline minRows={8} />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Editable variant="outlined" label="Export URL" value={exportUrl} onChange={(value) => handleDataChange('export_url', value)} />
                            </Grid>
                        </Grid>
                    </Stack>
                </CardContent>

                <CardActions>
                    <Button fullWidth startIcon={<Icon icon="left" />} variant="text" onClick={handleRecommendationsNavigate}>
                        Back
                    </Button>
                    <Button fullWidth color="error" startIcon={<Icon icon="delete" />} variant="text" onClick={handleOpenDeleteConfirm} disabled={!recommendationId}>
                        Delete
                    </Button>
                </CardActions>
            </Box>

            <ConfirmAction
                open={confirmOpen}
                icon="delete"
                title="Delete recommendation?"
                body="This recommendation will be removed from the list."
                handleConfirm={handleDelete}
                handleClose={handleCloseDeleteConfirm}
            />
        </>
    );
};

export default RecommendationDetail;
