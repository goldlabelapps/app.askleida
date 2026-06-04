'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
    Alert,
    Box,
    Button,
    CardHeader,
    CircularProgress,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material';
import { useDispatch } from '../../../NX/Uberedux';
import { Icon, navigateTo } from '../../../NX/DesignSystem';
import { useSupabaseAuth } from '../../../NX/Paywall';
import { initRecommendations } from './actions/initRecommendations';
import { useRecommendations } from './hooks/useRecommendations';

const getDataObject = (value: unknown): Record<string, unknown> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    return value as Record<string, unknown>;
};

const getStringValue = (value: unknown): string => {
    if (typeof value !== 'string') {
        return '';
    }

    return value.trim();
};

const getRecommendationTitle = (recommendation: any): string => {
    const data = getDataObject(recommendation?.data);
    const clientName = getStringValue(data.client_name);
    return getStringValue(recommendation?.title) || clientName || 'Untitled recommendation';
};

const getRecommendationSummary = (recommendation: any): string => {
    const data = getDataObject(recommendation?.data);
    const clientName = getStringValue(data.client_name);
    const therapistContext = getStringValue(data.therapist_context);
    const draft = getStringValue(data.draft);

    if (clientName) {
        return clientName;
    }

    if (therapistContext) {
        return therapistContext;
    }

    if (draft) {
        return draft.slice(0, 120);
    }

    return 'No recommendation details yet';
};

export default function Recommendations() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useSupabaseAuth();
    const recommendations = useRecommendations();
    const list = Array.isArray(recommendations?.list) ? recommendations.list : [];
    const titleText = list.length > 0 ? `Recommendations (${list.length})` : 'Recommendations';

    React.useEffect(() => {
        if (!recommendations?.initted && !recommendations?.loading && user?.id) {
            dispatch(initRecommendations(user.id));
        }
    }, [dispatch, recommendations?.initted, recommendations?.loading, user?.id]);

    const handleNew = () => {
        dispatch(navigateTo(router, '/recommendations/new'));
    };

    return (
        <Box>
            <CardHeader
                avatar={
                    <>
                        {recommendations?.loading ? (
                            <CircularProgress size={20} />
                        ) : (
                            <Box sx={{ mt: 1, ml: 1 }}>
                                <Icon icon="recommendation" color="primary" />
                            </Box>
                        )}
                    </>
                }
                title={<Typography variant="h6">{titleText}</Typography>}
                action={<Button endIcon={<Icon icon="add" />} color="primary" onClick={handleNew}>New</Button>}
            />

            {recommendations?.loading ? null : recommendations?.error ? (
                <Alert severity="error">{String(recommendations.error)}</Alert>
            ) : (
                <List dense>
                    {list.map((recommendation: any) => {
                        const recommendationId = recommendation?.recommendation_id;
                        const itemKey = String(recommendationId || getRecommendationTitle(recommendation));

                        return (
                            <ListItem key={itemKey} disablePadding>
                                <ListItemButton
                                    disabled={!recommendationId}
                                    onClick={() => {
                                        if (recommendationId) {
                                            dispatch(navigateTo(router, `/recommendations/${recommendationId}`));
                                        }
                                    }}
                                >
                                    <ListItemText
                                        primary={<Typography variant="subtitle1">{getRecommendationTitle(recommendation)}</Typography>}
                                        secondary={getRecommendationSummary(recommendation)}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            )}
        </Box>
    );
}
