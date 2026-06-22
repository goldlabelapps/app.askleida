"use client";
import React from 'react';
import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from '@mui/material';
import { useLivingRoutine } from '../../../Leida';

type T_LivingRoutine = {
    clientId: string;
};

const placeholderTips = [
    'Take a 10 minute walk after your largest meal.',
    'Aim for consistent sleep and wake times for 5 days this week.',
    'Hydrate before caffeine in the morning.',
];

const placeholderProducts = [
    { name: 'Protein Support (Placeholder)', cadence: '1 scoop each morning' },
    { name: 'Magnesium Blend (Placeholder)', cadence: '1 capsule with dinner' },
    { name: 'Omega-3 (Placeholder)', cadence: '2 softgels with lunch' },
];

const toObject = (value: unknown): Record<string, unknown> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    return value as Record<string, unknown>;
};

const toStringArray = (value: unknown): string[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
};

const LivingRoutine: React.FC<T_LivingRoutine> = ({ clientId }) => {
    const routineState = useLivingRoutine();
    const routine = toObject(routineState?.routine);
    const productsFromState = Array.isArray(routine.products)
        ? routine.products
            .map((item) => {
                const record = toObject(item);
                const name = typeof record.name === 'string' ? record.name.trim() : '';
                const cadence = typeof record.cadence === 'string' ? record.cadence.trim() : '';
                return name ? { name, cadence: cadence || 'Use as directed.' } : null;
            })
            .filter((item): item is { name: string; cadence: string } => Boolean(item))
        : [];
    const tipsFromState = toStringArray(routine.tips);
    const overviewFromState = toStringArray(routine.overview);

    const tips = tipsFromState.length > 0 ? tipsFromState : placeholderTips;
    const products = productsFromState.length > 0 ? productsFromState : placeholderProducts;
    const overviewParagraphs = overviewFromState.length > 0
        ? overviewFromState
        : [
            'Focus on simple, repeatable actions each day. Small consistent steps drive long-term progress.',
            'Use this routine as your daily reference. If anything feels unclear, contact your practitioner for clarification.',
        ];

    React.useEffect(() => {
        console.log('[LivingRoutine] client_id:', clientId);
    }, [clientId]);

    return (
        <Box sx={{ maxWidth: 860, mx: 'auto', px: 2, py: 3 }}>
            <Stack spacing={2.5}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                        Your Living Routine
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        This is your personalized routine space. Your practitioner can update this plan over time.
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                        <Chip label={`Client: ${clientId}`} size="small" />
                        <Chip label="Placeholder content" size="small" color="warning" variant="outlined" />
                    </Stack>
                </Box>

                <Alert severity="info">
                    {routineState?.loading
                        ? 'Loading your routine...'
                        : 'Your latest routine details will appear here once your practitioner publishes updates.'}
                </Alert>

                <Card elevation={0} variant="outlined">
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Overview
                        </Typography>
                        <Stack spacing={1}>
                            {overviewParagraphs.map((paragraph) => (
                                <Typography key={paragraph} variant="body2" color="text.secondary">
                                    {paragraph}
                                </Typography>
                            ))}
                        </Stack>
                    </CardContent>
                </Card>

                <Card elevation={0} variant="outlined">
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 1.5 }}>
                            Daily Tips
                        </Typography>
                        <Stack spacing={1}>
                            {tips.map((tip, index) => (
                                <Box key={tip}>
                                    <Typography variant="body2">
                                        {`${index + 1}. ${tip}`}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </CardContent>
                </Card>

                <Card elevation={0} variant="outlined">
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 1.5 }}>
                            Products
                        </Typography>
                        <Stack spacing={1.25}>
                            {products.map((product) => (
                                <Box key={product.name}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {product.cadence}
                                    </Typography>
                                    <Divider sx={{ mt: 1.25 }} />
                                </Box>
                            ))}
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </Box>
    );
};

export default LivingRoutine;