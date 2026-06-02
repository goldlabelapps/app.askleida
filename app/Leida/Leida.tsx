"use client";
import React from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    Box,
    Button,
    Container,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';
import type { T_Theme } from '../NX/types';
import { useDispatch } from '../NX/Uberedux';
import { 
    DesignSystem, 
    Feedback, 
    setDesignSystem, 
    useDesignSystem,
    Icon,
    ConfirmAction,
    navigateTo,
} from '../NX/DesignSystem';
import {
    BottomNav,
    Clients,
    ClientDetail,
} from '../Leida';
import { initClients, useClients } from './components/Clients';
import { setPaywall, useSupabaseAuth } from '../NX/Paywall';
import { supabase } from '../NX/lib/supabase';

const getTimeGreeting = (date = new Date()) => {
    const hour = date.getHours();

    if (hour < 12) {
        return 'Good Morning';
    }

    if (hour < 18) {
        return 'Good Afternoon';
    }

    return 'Good Evening';
};


const Leida: React.FC<any> = ({
    config,
}) => {
    
    const dispatch = useDispatch();
    const router = useRouter();
    const { user } = useSupabaseAuth();
    const pathname = usePathname();
    const clientsState = useClients();
    const designSystem = useDesignSystem();
    const defaultTheme = config?.cartridges?.designSystem?.defaultTheme;
    const themeSwitching = config?.cartridges?.designSystem?.themeSwitching;
    const themeMode = designSystem?.themeMode || defaultTheme;
    const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

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

    const handleStart = () => {
        dispatch(navigateTo(router, '/recommendation'));
    }

    const handleOpenSignoutConfirm = () => setIsConfirmOpen(true);
    const handleCloseSignoutConfirm = () => setIsConfirmOpen(false);
    const routeParts = (pathname || '/').split('/').filter(Boolean);
    const isClientsRoute = routeParts[0] === 'clients';
    const clientId = isClientsRoute && routeParts[1] ? routeParts[1] : null;
    const clientList = Array.isArray(clientsState?.list) ? clientsState.list : [];
    const selectedClient = clientId
        ? clientList.find((client: any) => client?.client_id === clientId) || null
        : null;

    React.useEffect(() => {
        if (isClientsRoute && user?.id && !clientsState?.initted && !clientsState?.loading) {
            dispatch(initClients(user.id));
        }
    }, [dispatch, isClientsRoute, user?.id, clientsState?.initted, clientsState?.loading]);

    const bottomNavValue = isClientsRoute ? 'clients' : 'home';
    const bottomNavItems = [
        {
            label: 'Home',
            value: 'home',
            icon: 'home' as const,
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
        // {
        //     label: 'Recommendations',
        //     value: 'recommendations',
        //     icon: 'recommendation' as const,
        //     href: '/recommendations',
        // },
        
    ];

    return (
        <DesignSystem theme={theme as T_Theme} config={config}>
            <Feedback />
            <nav className="site-nav">
                <div className="nav-inner">
                    <a href="/" className="logo-link">
                        <Image
                            src={`/askleida/svg/logo-dark.svg`}
                            alt="Leida"
                            width={110}
                            height={22}
                            className="logo" />
                    </a>

                    <IconButton onClick={handleOpenSignoutConfirm}>
                        <Icon icon="signout" color="primary" />
                    </IconButton>
                </div>
            </nav>
            
            <main style={{ paddingBottom: 88 }}>
                <Container sx={{mt:3 }}>
                    {isClientsRoute && clientId ? (
                        <ClientDetail config={config} client={selectedClient} />
                    ) : isClientsRoute ? (
                        <Clients />
                    ) : (
                        <Box sx={{ minHeight: 'calc(100vh - 220px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Container maxWidth="xs">
                                <Stack alignItems="center" textAlign="center" spacing={2.5}>
                                    <Typography variant="h4" sx={{ my: 1 }}>
                                        {getTimeGreeting()},
                                    </Typography>

                                    <Button
                                        variant="outlined"
                                        startIcon={<Icon icon="recommendation" />}
                                        onClick={handleStart}
                                    >
                                        Start a Recommendation
                                    </Button>
                                </Stack>
                            </Container>
                        </Box>
                    )}
                </Container>
            </main>

            <ConfirmAction
                open={isConfirmOpen}
                icon="signout"
                title="Sign out?"
                body="Are you sure you want to sign out?"
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

/*

*/