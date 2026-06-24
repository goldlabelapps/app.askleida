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
    Wrapper,
    useLivingRoutine,
} from '../../../Leida';

type T_LivingRoutine = {
    accessLevel: number;
};

const placeholderTips = [
    'Take a 10 minute walk after your largest meal.',
    // 'Aim for consistent sleep and wake times for 5 days this week.',
    // 'Hydrate before caffeine in the morning.',
];

const placeholderProducts = [
    { name: 'Protein Support (Placeholder)', cadence: '1 scoop each morning' },
    // { name: 'Magnesium Blend (Placeholder)', cadence: '1 capsule with dinner' },
    // { name: 'Omega-3 (Placeholder)', cadence: '2 softgels with lunch' },
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

const pickString = (value: unknown): string => {
    return typeof value === 'string' ? value.trim() : '';
};

const LivingRoutine: React.FC<T_LivingRoutine> = ({ accessLevel }) => {
    const dispatch = useDispatch();
    const { user } = useSupabaseAuth();
    const routineState = useLivingRoutine();
    const [authClientRecord, setAuthClientRecord] = React.useState<Record<string, unknown> | null>(null);
    const [authClientLoading, setAuthClientLoading] = React.useState(false);
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
    const tipsFromState = toStringArray(routine.tips);
    const overviewFromState = toStringArray(routine.overview);
    const resolvedAuthClientId = pickString(authClientRecord?.client_id);

    const tips = tipsFromState.length > 0 ? tipsFromState : placeholderTips;
    const products = productsFromState.length > 0 ? productsFromState : placeholderProducts;
    const overviewParagraphs = overviewFromState.length > 0
        ? overviewFromState
        : [
            'Focus on simple, repeatable actions each day. Small consistent steps drive long-term progress.',
            // 'Use this routine as your daily reference. If anything feels unclear, contact your practitioner for clarification.',
        ];
    const clientDisplayName = pickString(currentClientData.display_name) || 'Unknown client';
    const clientEmail = pickString(currentClientData.email);
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
            setAuthClientRecord(null);
            setAuthClientError(null);
            setAuthClientLoading(false);
            return;
        }


        
        let cancelled = false;
        const controller = new AbortController();

        const loadClientById = async () => {
            try {
                setAuthClientLoading(true);
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
            } finally {
                if (!cancelled) {
                    setAuthClientLoading(false);
                }
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
        return null;
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
                            <Box
                                sx={{
                                    mb: 2,
                                    p: 2,
                                }}
                            >
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    Hello {clientDisplayName}, 
                                </Typography>
                                
                                {/* <Typography variant="body2">
                                    {clientEmail || 'Not provided'}
                                </Typography> */}

                                <Typography variant="overline" sx={{ my: 3 }}>
                                    Your Routine
                                </Typography>

                                {overviewParagraphs.map((paragraph) => (
                                    <Typography key={paragraph} variant="body1">
                                        {paragraph}
                                    </Typography>
                                ))}

                                <Typography variant="overline" sx={{ my: 3 }}>
                                    Tips
                                </Typography>
                                {tips.map((tip, index) => (
                                    <Box key={tip}>
                                        <Typography variant="body2">
                                            {`${index + 1}. ${tip}`}
                                        </Typography>
                                    </Box>
                                ))}

                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Box
                                sx={{
                                    mb: 3,
                                    p: 2,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    bgcolor: 'background.paper',
                                }}
                            >
                                
                                <Typography variant="h6" sx={{ my: 2 }}>
                                    Products
                                </Typography>

                                {products.map((product) => (
                                    <Box key={product.name}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                            {product.name}
                                        </Typography>
                                        <Typography variant="body2">
                                            {product.cadence}
                                        </Typography>
                                    </Box>
                                ))}


                            </Box>
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