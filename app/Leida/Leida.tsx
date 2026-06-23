"use client";
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
    Box,
    Container,
    Typography,
} from '@mui/material';
import type { T_Config, T_Theme } from '../NX/types';
import { useDispatch } from '../NX/Uberedux';
import { 
    DesignSystem, 
    Feedback, 
    setDesignSystem, 
    useDesignSystem,
    ConfirmAction,
    navigateTo,
} from '../NX/DesignSystem';
import { setPaywall, useSupabaseAuth } from '../NX/Paywall';
import { supabase } from '../NX/lib/supabase';
import {
    BottomNav,
    Clients,
    initClients,
    useClients,
    ClientDetail,
    ClientNew,
    TipDetail,
    TipNew,
    Account,
    Tips,
    Header,
    Home,
    LivingRoutine,
    initAccount,
    useAccount,
    initTips,
    useTips,
    initLivingRoutine,
    useLivingRoutine,
} from '../Leida';

type LeidaProps = {
    config?: T_Config;
};

type PractitionerAccountRow = {
    practitioner_id?: string | null;
    data?: Record<string, unknown> | null;
};

type RoutedClient = {
    client_id?: string | null;
};

type RoutedTip = {
    tip_id?: string | null;
};

const toNumericAccessLevel = (value: unknown) => {
    const normalizedValue = typeof value === 'string' ? value.trim() : value;
    const parsedValue = Number(normalizedValue);
    return Number.isFinite(parsedValue) ? parsedValue : null;
};

const resolveAccessLevel = (accountRow: PractitionerAccountRow | null) => {
    const practitionerData = accountRow?.data;
    if (!practitionerData || typeof practitionerData !== 'object' || Array.isArray(practitionerData)) {
        return 0;
    }

    return toNumericAccessLevel(practitionerData.access_level) ?? 0;
};


const Leida: React.FC<LeidaProps> = ({
    config,
}) => {
    
    const dispatch = useDispatch();
    const router = useRouter();
    const { user } = useSupabaseAuth();
    const authenticatedClientId = String(user?.user_metadata?.client_id ?? user?.id ?? 'unknown');
    const authenticatedClientRoute = `/client/${authenticatedClientId}`;
    const pathname = usePathname();
    const accountState = useAccount();
    const accountRows: PractitionerAccountRow[] = Array.isArray(accountState?.data) ? accountState.data as PractitionerAccountRow[] : [];
    const accessLevel = resolveAccessLevel(accountRows[0] ?? null);
    const clientsState = useClients();
    const tipsState = useTips();
    const livingRoutineState = useLivingRoutine();
    const designSystem = useDesignSystem();
    const defaultTheme = config?.cartridges?.designSystem?.defaultTheme;
    const themeSwitching = config?.cartridges?.designSystem?.themeSwitching;
    const themeMode = designSystem?.themeMode || defaultTheme;
    const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
    const practitionerId = typeof accountRows[0]?.practitioner_id === 'string'
        ? accountRows[0].practitioner_id.trim()
        : '';

    React.useEffect(() => {
        if (user) {
            console.log('[Leida] practitioner access level:', accessLevel);
        }
    }, [accessLevel, user]);

    React.useEffect(() => {
        if (!designSystem?.themeMode && defaultTheme) {
            dispatch(setDesignSystem("themeMode", defaultTheme));
            dispatch(setDesignSystem("themeSwitching", themeSwitching));
        }
    }, [dispatch, designSystem?.themeMode, defaultTheme, themeSwitching]);

    let theme = config?.cartridges?.designSystem?.themes?.[themeMode];
    if (theme) {
        const mode: 'light' | 'dark' = themeMode === 'dark' ? 'dark' : 'light';
        theme = { ...theme, mode };
    }

    const handleSignout = async () => {
        await supabase.auth.signOut();
        dispatch(setPaywall('supabaseAuth', null));
        setIsConfirmOpen(false);
    };

    const handleHome = () => {
        dispatch(navigateTo(router, '/'));
    };

    const handleCloseSignoutConfirm = () => setIsConfirmOpen(false);
    const routeParts = (pathname || '/').split('/').filter(Boolean);
    const isClientsRoute = routeParts[0] === 'clients';
    const isClientRoutineRoute = routeParts[0] === 'client';
    const isAccountRoute = routeParts[0] === 'account';
    const isTipsRoute = routeParts[0] === 'tips';
    const isClientNewRoute = isClientsRoute && routeParts[1] === 'new';
    const isTipNewRoute = isTipsRoute && routeParts[1] === 'new';
    const clientId = isClientsRoute && routeParts[1] ? routeParts[1] : null;
    const tipId = isTipsRoute && routeParts[1] ? routeParts[1] : null;
    const clientList = Array.isArray(clientsState?.list) ? clientsState.list : [];
    const tipList = Array.isArray(tipsState?.list) ? tipsState.list : [];
    const selectedClient = clientId
        ? clientList.find((client: RoutedClient) => client?.client_id === clientId) || null
        : null;
    const selectedTip = tipId
        ? tipList.find((tip: RoutedTip) => tip?.tip_id === tipId) || null
        : null;

    React.useEffect(() => {
        if (user?.email && !accountState?.initted && !accountState?.loading) {
            dispatch(initAccount(user.email));
        }
    }, [dispatch, user?.email, accountState?.initted, accountState?.loading]);

    React.useEffect(() => {
        if (practitionerId && !clientsState?.initted && !clientsState?.loading) {
            dispatch(initClients(practitionerId));
        }
    }, [dispatch, practitionerId, clientsState?.initted, clientsState?.loading]);

    React.useEffect(() => {
        if (isTipsRoute && user?.id && !tipsState?.initted && !tipsState?.loading) {
            dispatch(initTips(user.id));
        }
    }, [dispatch, isTipsRoute, user?.id, tipsState?.initted, tipsState?.loading]);

    React.useEffect(() => {
        if (accessLevel !== 2) {
            return;
        }

        if (!authenticatedClientId || authenticatedClientId === 'unknown') {
            return;
        }

        if (!livingRoutineState?.initted && !livingRoutineState?.loading) {
            dispatch(initLivingRoutine(authenticatedClientId));
        }
    }, [
        accessLevel,
        authenticatedClientId,
        dispatch,
        livingRoutineState?.initted,
        livingRoutineState?.loading,
    ]);

    React.useEffect(() => {
        if (accessLevel !== 2) {
            return;
        }

        if (!authenticatedClientId || authenticatedClientId === 'unknown') {
            return;
        }

        if (pathname !== authenticatedClientRoute) {
            dispatch(navigateTo(router, authenticatedClientRoute));
        }
    }, [
        accessLevel,
        authenticatedClientId,
        authenticatedClientRoute,
        dispatch,
        pathname,
        router,
    ]);

    const bottomNavValue = isClientsRoute
        ? 'clients'
        : isTipsRoute
            ? 'tips'
            : 'account';

    const bottomNavItems = [
        {
            label: 'Account',
            value: 'account',
            icon: 'user' as const,
            href: '/',
        },

        {
            label: 'Clients',
            value: 'clients',
            icon: 'clients' as const,
            href: '/clients',
        },

        {
            label: 'Tips',
            value: 'tips',
            icon: 'tips' as const,
            href: '/tips',
        },
    ];

    // if (!accessLevel) return null;

    if (accessLevel === 2) {
        return <LivingRoutine clientId={authenticatedClientId} accessLevel={accessLevel} />;
    }

    if (isClientRoutineRoute) {
        return (
            <DesignSystem theme={theme as T_Theme} config={config}>
                <main>
                    <Container sx={{ mt: 3 }}>
                        <Box sx={{ mx: 1.5 }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                Client View Only
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                This route is reserved for client accounts.
                            </Typography>
                        </Box>
                    </Container>
                </main>
            </DesignSystem>
        );
    }

    return (
        <DesignSystem theme={theme as T_Theme} config={config}>
            <Feedback />
            <Header onHome={handleHome} />
            <main style={{ paddingBottom: 88 }}>
                <Container sx={{mt:3 }}>
                    <Box sx={{ mx: 1.5 }}>
                    {isClientNewRoute ? (
                        <ClientNew config={config} />
                    ) : isClientsRoute && clientId ? (
                        <ClientDetail config={config} client={selectedClient} />
                    ) : isClientsRoute ? (
                        <Clients />
                    ) : isTipNewRoute ? (
                        <TipNew config={config} />
                    ) : isTipsRoute && tipId ? (
                        <TipDetail tip={selectedTip} />
                    ) : isAccountRoute ? (
                        <Account />
                    ) : isTipsRoute ? (
                        <Tips />
                    ) : (
                        <Home />
                    )}
                    </Box>
                </Container>
            </main>

            <ConfirmAction
                open={isConfirmOpen}
                icon="signout"
                title="Sign out?"
                body="For reals?"
                handleConfirm={handleSignout}
                handleClose={handleCloseSignoutConfirm}
            />

            <BottomNav
                value={bottomNavValue}
                items={bottomNavItems}
            />
            
        </DesignSystem>
    );
};

export default Leida;
