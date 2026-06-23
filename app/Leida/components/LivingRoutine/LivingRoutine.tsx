"use client";
import React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    Alert,
    Box,
    Button,
    ButtonBase,
    CardContent,
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
    clientId: string;
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

const LivingRoutine: React.FC<T_LivingRoutine> = ({ clientId, accessLevel }) => {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const { user } = useSupabaseAuth();
    const routineState = useLivingRoutine();
    const currentClient = toObject(routineState?.currentClient);
    const practitioner = routineState?.practitioner ?? null;
    const practitionerLoading = Boolean(routineState?.practitionerLoading);
    const practitionerError = typeof routineState?.practitionerError === 'string'
        ? routineState.practitionerError
        : null;
    const email = String(user?.email || 'No email available');
    const [confirmSignoutOpen, setConfirmSignoutOpen] = React.useState(false);
    const [isSigningOut, setIsSigningOut] = React.useState(false);
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
    const pathClientId = React.useMemo(() => {
        const parts = (pathname || '/').split('/').filter(Boolean);
        return parts[0] === 'client' && parts[1] ? parts[1] : '';
    }, [pathname]);
    const effectiveClientId = pathClientId || clientId;

    const tips = tipsFromState.length > 0 ? tipsFromState : placeholderTips;
    const products = productsFromState.length > 0 ? productsFromState : placeholderProducts;
    const overviewParagraphs = overviewFromState.length > 0
        ? overviewFromState
        : [
            'Focus on simple, repeatable actions each day. Small consistent steps drive long-term progress.',
            // 'Use this routine as your daily reference. If anything feels unclear, contact your practitioner for clarification.',
        ];
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
        console.log('[LivingRoutine] client_id (prop):', clientId);
        console.log('[LivingRoutine] client_id (path):', pathClientId);
        console.log('[LivingRoutine] client_id (effective):', effectiveClientId);
        console.log('[LivingRoutine] accessLevel:', accessLevel);
    }, [accessLevel, clientId, effectiveClientId, pathClientId]);

    React.useEffect(() => {
        dispatch(initCurrentClient(effectiveClientId, user?.email || ''));
    }, [dispatch, effectiveClientId, user?.email]);

    return (
        <>
        <Box sx={{height: 16}} />

            <Typography variant="h6" sx={{ my: 2 }}>
                Current Client
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                client_id: {effectiveClientId || 'unknown'}
            </Typography>
            <pre>
                {JSON.stringify(currentClient, null, 2)}
            </pre>

            <Typography variant="h6" sx={{ my: 2 }}>
                Practitioner
            </Typography>
            {practitionerLoading ? (
                <Typography variant="body2" color="text.secondary">
                    Loading practitioner...
                </Typography>
            ) : null}
            {practitionerError ? (
                <Typography variant="body2" color="error.main" sx={{ mb: 1 }}>
                    {practitionerError}
                </Typography>
            ) : null}

            <pre>
                {JSON.stringify(practitioner, null, 2)}
            </pre>



            <Wrapper>
                {isBusy ? <LinearProgress sx={{ mb: 2 }} /> : null}

                <Alert severity="info" sx={{ }}
                    action={<>
                        <Button
                            color="primary"
                            variant="text"
                            onClick={handleRequestSignout}
                            startIcon={<Icon icon="signout" />}
                            disabled={isBusy}
                        >
                            Logout
                        </Button>
                    </>}
                >
                    {routineState?.loading
                        ? 'Loading your routine...'
                        : 'Your latest routine details will appear here once your practitioner publishes updates.'}
                </Alert>

                <CardContent>

                    <Typography variant="h6" sx={{ my: 2 }}>
                        Blurb
                    </Typography>
                    {overviewParagraphs.map((paragraph) => (
                        <Typography key={paragraph} variant="body2" color="text.secondary">
                            {paragraph}
                        </Typography>
                    ))}

                    <Typography variant="h6" sx={{ my: 2 }}>
                        Products
                    </Typography>
                    {products.map((product) => (
                        <Box key={product.name}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {product.cadence}
                            </Typography>
                        </Box>
                    ))}

                    <Typography variant="h6" sx={{ my: 2 }}>
                        Tips
                    </Typography>
                    {tips.map((tip, index) => (
                        <Box key={tip}>
                            <Typography variant="body2">
                                {`${index + 1}. ${tip}`}
                            </Typography>
                        </Box>
                    ))}

                    
                    
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

            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', pt: 3 }}>

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
        </>
    );
};

export default LivingRoutine;