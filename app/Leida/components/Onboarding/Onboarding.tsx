'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    LinearProgress,
    Stack,
    Typography,
} from '@mui/material';
import { navigateTo } from '../../../NX/DesignSystem';
import { useSupabaseAuth } from '../../../NX/Paywall';
import { useDispatch } from '../../../NX/Uberedux';
import { useClients } from '../Clients';
import { useRecommendations } from '../Recommendations';
import { initOnboarding } from './actions/initOnboarding';
import { setOnboarding } from './actions/setOnboarding';
import { useOnboarding } from './hooks/useOnboarding';

const getStepValue = (value: unknown): boolean => {
    return value === true;
};

export default function Onboarding() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useSupabaseAuth();
    const onboarding = useOnboarding();
    const clients = useClients();
    const recommendations = useRecommendations();
    const onboardingEnabled = false;

    if (!onboardingEnabled) {
        return null;
    }
    const clientsCount = Array.isArray(clients?.list) ? clients.list.length : 0;
    const recommendationsCount = Array.isArray(recommendations?.list) ? recommendations.list.length : 0;

    React.useEffect(() => {
        if (!user?.id || onboarding?.loading || onboarding?.initted) {
            return;
        }

        dispatch(initOnboarding(user.id));
    }, [dispatch, user?.id, onboarding?.loading, onboarding?.initted]);

    React.useEffect(() => {
        if (!user?.id || !onboarding?.initted) {
            return;
        }

        const needsClientStepSync = !getStepValue(onboarding?.data?.createFirstClient) && clientsCount > 0;
        const needsRoutingStepSync = !getStepValue(onboarding?.data?.publishFirstLivingRouting)
            && recommendationsCount > 0;

        if (needsClientStepSync || needsRoutingStepSync) {
            dispatch(initOnboarding(user.id));
        }
    }, [
        dispatch,
        user?.id,
        onboarding?.initted,
        onboarding?.data?.createFirstClient,
        onboarding?.data?.publishFirstLivingRouting,
        clientsCount,
        recommendationsCount,
    ]);

    const stepSetPassword = getStepValue(onboarding?.data?.setPassword);
    const stepCreateClient = getStepValue(onboarding?.data?.createFirstClient);
    const stepPublishRouting = getStepValue(onboarding?.data?.publishFirstLivingRouting);
    const completed = stepSetPassword && stepCreateClient && stepPublishRouting;
    const open = Boolean(onboarding?.open);

    const handleClose = () => {
        if (!completed) {
            return;
        }

        dispatch(setOnboarding('open', false));
    };

    return (
        <Dialog
            open={open}
            onClose={(_, reason) => {
                if (!completed) {
                    return;
                }

                if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
                    handleClose();
                }
            }}
            fullWidth
            maxWidth="sm"
        >
            {onboarding?.loading ? <LinearProgress /> : null}

            <DialogTitle>Welcome to Leida</DialogTitle>
            <DialogContent>
                <Stack spacing={1.5} sx={{ pt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Complete these steps to finish onboarding.
                    </Typography>

                    <Box>
                        <FormControlLabel
                            control={<Checkbox checked={stepSetPassword} disabled />}
                            label="Set password"
                        />
                    </Box>

                    <Box>
                        <FormControlLabel
                            control={<Checkbox checked={stepCreateClient} disabled />}
                            label="Create first client"
                        />
                        {!stepCreateClient ? (
                            <Button
                                variant="text"
                                color="primary"
                                onClick={() => dispatch(navigateTo(router, '/clients/new'))}
                            >
                                Create first client
                            </Button>
                        ) : null}
                    </Box>

                    <Box>
                        <FormControlLabel
                            control={<Checkbox checked={stepPublishRouting} disabled />}
                            label="Publish first living routing"
                        />
                        {!stepPublishRouting ? (
                            <Button
                                variant="text"
                                color="primary"
                                onClick={() => dispatch(navigateTo(router, '/recommendations/new'))}
                            >
                                Publish first living routing
                            </Button>
                        ) : null}
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleClose} disabled={!completed}>
                    {completed ? 'Done' : 'Complete all steps to continue'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
