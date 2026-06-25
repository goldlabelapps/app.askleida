"use client";
import React from 'react';
import Image from 'next/image';
import {
    Alert,
    Avatar,
    Box,
    Button,
    IconButton,
    ButtonBase,
    CardContent,
    Container,
    Grid,
    LinearProgress,
    Typography,
} from '@mui/material';
import { ConfirmAction, Icon } from '../../../NX/DesignSystem';
import { setPaywall, useSupabaseAuth } from '../../../NX/Paywall';
import { useDispatch } from '../../../NX/Uberedux';
import { supabase } from '../../../NX/lib/supabase';
import { 
    initCurrentClient,
    initLivingRoutine,
    RenderProducts,
    Wrapper,
    useLivingRoutine,
} from '../../../Leida';

type T_LivingRoutine = {
    accessLevel: number;
    previewClientId?: string | null;
    previewMode?: boolean;
};

const toObject = (value: unknown): Record<string, unknown> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    return value as Record<string, unknown>;
};

const pickString = (value: unknown): string => {
    return typeof value === 'string' ? value.trim() : '';
};

const LivingRoutine: React.FC<T_LivingRoutine> = ({ accessLevel, previewClientId = null, previewMode = false }) => {
    const dispatch = useDispatch();
    const { user } = useSupabaseAuth();
    const routineState = useLivingRoutine();
    const [authClientRecord, setAuthClientRecord] = React.useState<Record<string, unknown> | null>(null);
    const [authClientError, setAuthClientError] = React.useState<string | null>(null);
    const currentClient = toObject(routineState?.currentClient);
    const currentClientData = toObject(currentClient.data);
    const practitioner = routineState?.practitioner ?? null;
    const practitionerObject = toObject(practitioner);
    const practitionerData = toObject(practitionerObject.data);
    const practitionerProfile = toObject(practitionerData.profile);
    const practitionerLoading = Boolean(routineState?.practitionerLoading);
    const practitionerError = typeof routineState?.practitionerError === 'string'
        ? routineState.practitionerError
        : null;
    const email = String(user?.email || 'No email available');
    const [confirmSignoutOpen, setConfirmSignoutOpen] = React.useState(false);
    const [isSigningOut, setIsSigningOut] = React.useState(false);
    const [isRoutineAlertVisible, setIsRoutineAlertVisible] = React.useState(false);
    const routine = toObject(routineState?.routine);
    const resolvedAuthClientId = pickString(authClientRecord?.client_id);
    const resolvedPreviewClientId = pickString(previewClientId);
    const isPreviewMode = Boolean(previewMode);
    const clientDisplayName = pickString(currentClientData.display_name) || 'Unknown client';
    const clientEmail = pickString(currentClientData.email);
    const skinOverview = pickString(currentClientData.skin_overview);
    const practitionerName =
        pickString(practitionerData.display_name) ||
        pickString(practitionerData.name) ||
        pickString(practitionerProfile.name) ||
        pickString(practitionerObject.title) ||
        'Unknown practitioner';
    const practitionerEmail = pickString(practitionerData.email);
    const practitionerClinic = pickString(practitionerData.clinic);
    const practitionerWebsite = pickString(practitionerData.website);
    const practitionerAvatar = pickString(practitionerData.avatar);
    const practitionerOnboarding = toObject(practitionerData.onboarding);
    const practitionerOnboardingStatus = pickString(practitionerOnboarding.status);
    const loadedClientId = pickString(currentClient.client_id);
    const loadedPractitionerId = pickString(practitionerObject.practitioner_id);
    const hasLoadedClient = Boolean(loadedClientId);
    const hasLoadedPractitioner = Boolean(loadedPractitionerId);
    const isBusy = isSigningOut;

    const handleRequestSignout = () => {
        if (isPreviewMode) return;
        if (isBusy) return;
        setConfirmSignoutOpen(true);
    };

    const handleCancelSignout = () => {
        if (isBusy) return;
        setConfirmSignoutOpen(false);
    };

    const handleConfirmSignout = async () => {
        setIsSigningOut(true);
        setConfirmSignoutOpen(false);
        try {
            await supabase.auth.signOut();
            dispatch(setPaywall('supabaseAuth', null));
        } finally {
            setIsSigningOut(false);
        }
    };

    React.useEffect(() => {
        const authUserId = pickString(user?.id);

        if (isPreviewMode || accessLevel !== 2 || !authUserId) {
            return;
        }

        let cancelled = false;
        const controller = new AbortController();

        const loadClientById = async () => {
            try {
                setAuthClientError(null);

                const response = await fetch(`/api/clients?client_id=${encodeURIComponent(authUserId)}`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    },
                    signal: controller.signal,
                });

                const payload = await response.json();

                if (!response.ok) {
                    throw new Error(payload?.meta?.message || `Failed to fetch client (${response.status})`);
                }

                const row = toObject(payload?.data);
                if (!row.client_id || typeof row.client_id !== 'string') {
                    throw new Error(`No client found for client_id ${authUserId}`);
                }

                if (!cancelled) {
                    setAuthClientRecord(row);
                }
            } catch (e: unknown) {
                if (cancelled || controller.signal.aborted) {
                    return;
                }

                const message = e instanceof Error ? e.message : String(e);
                setAuthClientRecord(null);
                setAuthClientError(message);
            }
        };

        loadClientById();

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [accessLevel, isPreviewMode, user?.id]);

    React.useEffect(() => {
        if (!resolvedPreviewClientId) {
            return;
        }

        dispatch(initCurrentClient(resolvedPreviewClientId, user?.email || ''));

        if (!routineState?.initted && !routineState?.loading) {
            dispatch(initLivingRoutine(resolvedPreviewClientId));
        }
    }, [
        dispatch,
        resolvedPreviewClientId,
        routineState?.initted,
        routineState?.loading,
        user?.email,
    ]);

    React.useEffect(() => {
        if (resolvedPreviewClientId || !resolvedAuthClientId) {
            return;
        }

        dispatch(initCurrentClient(resolvedAuthClientId, user?.email || ''));
    }, [dispatch, resolvedAuthClientId, resolvedPreviewClientId, user?.email]);

    if (!hasLoadedClient || !hasLoadedPractitioner) {
        return (
            <Container sx={{ mt: 3 }}>
                <Box sx={{ mx: 1.5 }}>
                    <LinearProgress />
                </Box>
            </Container>
        );
    }

    return (
        <>

            <Container maxWidth="md" sx={{ }}>
                <nav className="site-nav">
                    <div className="nav-inner">
                        
                        <IconButton
                            color="primary"
                            disabled={isBusy}
                            onClick={() => {
                                if (practitionerWebsite) {
                                    window.open(practitionerWebsite, '_blank', 'noopener,noreferrer');
                                }
                            }}>
                            <Avatar
                                src={practitionerAvatar || undefined}
                                alt={practitionerName}
                                sx={{ width: 50, height: 50 }}
                            >
                                {practitionerName.slice(0, 1).toUpperCase()}
                            </Avatar>

                            </IconButton>

                        <Typography variant="h6" sx={{ ml: 2 }}>
                            {practitionerClinic || ''}
                        </Typography>

                        <Box sx={{ flexGrow: 1 }} />
                        <Typography variant="body2" sx={{ ml: 2 }}>
                            {isPreviewMode ? `Previewing ${clientDisplayName}` : email || ''}
                        </Typography>
                        {!isPreviewMode ? (
                            <IconButton
                                color="primary"
                                onClick={handleRequestSignout}
                                disabled={isBusy}
                            >
                                <Icon icon="signout" />
                            </IconButton>
                        ) : null}
                        

                    </div>
                </nav>
        </Container>
        
        <Container maxWidth="md" sx={{ mb: 2 }}>
            <Box sx={{height: 16}} />
            <Box sx={{px:4}}>
                <Wrapper>
                    {isBusy ? <LinearProgress sx={{ mb: 2 }} /> : null}

                    {isRoutineAlertVisible ? (
                        <Alert severity="info" sx={{ }}
                            action={<>
                                <Button
                                    
                                    color="primary"
                                    variant="text"
                                    onClick={() => setIsRoutineAlertVisible(false)}
                                    startIcon={<Icon icon="tick" />}
                                    disabled={isBusy}
                                >
                                    OK
                                </Button>
                            </>}
                        >
                            {routineState?.loading
                                ? 'Loading your routine...'
                                : 'Your latest routine details will appear here once your practitioner publishes updates.'}
                        </Alert>
                    ) : null}

                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 7 }}>
                                <Box>
                                    <Typography variant="h5" sx={{ mb: 1 }}>
                                        Hi {clientDisplayName}, 
                                    </Typography>

                                    <Typography variant="overline" sx={{ my: 3 }}>
                                        Your notes
                                    </Typography>

                                    <Typography variant="body1">
                                        {skinOverview || ''}
                                    </Typography>

                                </Box>
                            </Grid>
                            
                            <Grid size={{ xs: 12, sm: 5 }}>
                                <RenderProducts />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Typography variant="h6" sx={{ my: 2 }}>
                                    Love from {practitionerName} @ {practitionerClinic}
                                </Typography>
                            </Grid>

                        </Grid>
                    </CardContent>
                    {!isPreviewMode ? (
                        <ConfirmAction
                            open={confirmSignoutOpen}
                            icon="signout"
                            title="Sign out?"
                            body={`${clientDisplayName}, you are signed in as ${email}. Do you want to sign out now?`}
                            handleConfirm={handleConfirmSignout}
                            handleClose={handleCancelSignout}
                        />
                    ) : null}
                </Wrapper>
            </Box>

            <Box sx={{ 
                m: 2,
                display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Box sx={{mb:3}}>
                    <ButtonBase
                        component="a"
                        href="https://askleida.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ display: 'inline-flex' }}
                        aria-label="Open AskLeida website"
                    >
                        <Image
                            src={'/askleida/svg/logo-dark.svg'}
                            alt="Leida"
                            width={110}
                            height={22}
                            className="logo"
                        />
                    </ButtonBase>
                </Box>
            </Box>
        </Container>
            
        </>
    );
};

export default LivingRoutine;