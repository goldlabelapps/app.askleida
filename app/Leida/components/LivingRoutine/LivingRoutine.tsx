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
    RenderProducts,
    Wrapper,
    useLivingRoutine,
} from '../../../Leida';

type T_LivingRoutine = {
    accessLevel: number;
};

const placeholderProducts = [
    { name: 'Medik8 Surface Radiance Cleanse 150ml', cadence: 'Acting as the second step in your double cleansing routine, the non-stripping face wash utilises a blend of l-mandelic, l-lactic and salicylic acids to provide a gentle exfoliation, helping to decongest the pores and reduce texture' },
    { name: 'The Body Shop Vitamin C Glow Revealing Serum 30ml', cadence: 'Featuring four bestselling formulas, the Hair Gain Holiday Hair Kit refreshes, nourishes and revives dry, lacklustre lengths, while plumping fine strands with full-bodied moisture. ' },
];

const toObject = (value: unknown): Record<string, unknown> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    return value as Record<string, unknown>;
};

const pickString = (value: unknown): string => {
    return typeof value === 'string' ? value.trim() : '';
};

const LivingRoutine: React.FC<T_LivingRoutine> = ({ accessLevel }) => {
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
    const resolvedAuthClientId = pickString(authClientRecord?.client_id);

    const products = productsFromState.length > 0 ? productsFromState : placeholderProducts;
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

        if (accessLevel !== 2 || !authUserId) {
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
    }, [accessLevel, user?.id]);

    React.useEffect(() => {
        if (!resolvedAuthClientId) {
            return;
        }

        dispatch(initCurrentClient(resolvedAuthClientId, user?.email || ''));
    }, [dispatch, resolvedAuthClientId, user?.email]);

    if (!hasLoadedClient || !hasLoadedPractitioner) {
        return (
            <Container sx={{ mt: 3 }}>
                <Box sx={{ mx: 1.5 }}>
                    <Typography component="h1" variant="h3" sx={{ mb: 2 }}>
                        Access Level: {accessLevel}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Waiting for living routine data
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        client loaded: {String(hasLoadedClient)} | practitioner loaded: {String(hasLoadedPractitioner)} | auth client id: {resolvedAuthClientId || 'missing'} | user id: {pickString(user?.id) || 'missing'}
                    </Typography>
                    <LinearProgress />
                </Box>
            </Container>
        );
    }

    return (
        <>

        
                <nav className="site-nav">
                    <div className="nav-inner">


                        <ButtonBase>
                            {/*  */}
                            <Avatar
                                src={practitionerAvatar || undefined}
                                alt={practitionerName}
                                sx={{ width: 50, height: 50 }}
                            >
                                {practitionerName.slice(0, 1).toUpperCase()}
                            </Avatar>
                        </ButtonBase>
                        
                        <Typography variant="h6" sx={{ml: 2}}>
                            {practitionerClinic || ''}
                        </Typography>

                        <Box sx={{ flexGrow: 1 }} />
    
                        <IconButton
                            color="primary"
                            disabled={isBusy}
                            onClick={() => {
                                if (practitionerWebsite) {
                                    window.open(practitionerWebsite, '_blank', 'noopener,noreferrer');
                                }
                            }}>
                            <Icon icon="link" />
                        </IconButton>

                        {/* <IconButton
                            color="primary"
                            disabled={isBusy}
                            
                        >
                            <Icon icon="email" />
                        </IconButton> */}

                    </div>
                </nav>
        
        <Container maxWidth="md" sx={{ mb: 2 }}>
            <Box sx={{height: 16}} />
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
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Box>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    Hello {clientDisplayName}, 
                                </Typography>
                                
                                {/* <Typography variant="body2">
                                    {clientEmail || 'Not provided'}
                                </Typography> */}

                                <Typography variant="overline" sx={{ my: 3 }}>
                                    Skin Overview
                                </Typography>

                                <Typography variant="body1">
                                    {skinOverview || 'Routine and tips are coming soon.'}
                                </Typography>

                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <RenderProducts products={products} />
                        </Grid>
                    


                        <Grid size={{ xs: 12 }}>
                            <Typography variant="h6" sx={{ m: 2 }}>
                                Love from {practitionerName}
                            </Typography>
                        </Grid>

                    </Grid>

                    
                </CardContent>
                <ConfirmAction
                    open={confirmSignoutOpen}
                    icon="signout"
                    title="Sign out?"
                    body={`You are signed in as ${email}. Do you want to sign out now?`}
                    handleConfirm={handleConfirmSignout}
                    handleClose={handleCancelSignout}
                />
            </Wrapper>

            <Box sx={{ 
                mt:2,
                display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Box sx={{mt:0.5}}>
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
                <Button
                    color="primary"
                    variant="text"
                    onClick={handleRequestSignout}
                    startIcon={<Icon icon="signout" />}
                    disabled={isBusy}
                >
                </Button>

                
            </Box>
            
        </Container>
            
        </>
    );
};

export default LivingRoutine;