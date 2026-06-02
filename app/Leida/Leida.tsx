"use client";
import React from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
    Box,
    Button,
    ButtonBase,
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
    ClientNew,
    TipDetail,
    TipNew,
    Products,
    Recommendations,
    Tips,
} from '../Leida';
import { initClients, useClients } from './components/Clients';
import { initTips, useTips } from './components/Tips';
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
    const searchParams = useSearchParams();
    const { user } = useSupabaseAuth();
    const pathname = usePathname();
    const clientsState = useClients();
    const tipsState = useTips();
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

    const handleHome = () => {
        dispatch(navigateTo(router, '/'));
    };

    const handleStart = () => {
        dispatch(navigateTo(router, '/recommendations'));
    };

    const handleOpenSignoutConfirm = () => setIsConfirmOpen(true);
    const handleCloseSignoutConfirm = () => setIsConfirmOpen(false);
    const routeParts = (pathname || '/').split('/').filter(Boolean);
    const isClientsRoute = routeParts[0] === 'clients';
    const isProductsRoute = routeParts[0] === 'products';
    const isRecommendationsRoute = routeParts[0] === 'recommendations';
    const isTipsRoute = routeParts[0] === 'tips';
    const isClientNewRoute = isClientsRoute && routeParts[1] === 'new';
    const isTipNewRoute = isTipsRoute && routeParts[1] === 'new';
    const clientId = isClientsRoute && routeParts[1] ? routeParts[1] : null;
    const tipId = isTipsRoute && routeParts[1] ? routeParts[1] : null;
    const clientList = Array.isArray(clientsState?.list) ? clientsState.list : [];
    const tipList = Array.isArray(tipsState?.list) ? tipsState.list : [];
    const selectedClient = clientId
        ? clientList.find((client: any) => client?.client_id === clientId) || null
        : null;
    const selectedTip = tipId
        ? tipList.find((tip: any) => tip?.tip_id === tipId) || null
        : null;
    const avatarColor = searchParams.get('avatarColor') || undefined;

    React.useEffect(() => {
        if (isClientsRoute && user?.id && !clientsState?.initted && !clientsState?.loading) {
            dispatch(initClients(user.id));
        }
    }, [dispatch, isClientsRoute, user?.id, clientsState?.initted, clientsState?.loading]);

    React.useEffect(() => {
        if (isTipsRoute && user?.id && !tipsState?.initted && !tipsState?.loading) {
            dispatch(initTips(user.id));
        }
    }, [dispatch, isTipsRoute, user?.id, tipsState?.initted, tipsState?.loading]);

    const bottomNavValue = isClientsRoute
        ? 'clients'
        : isProductsRoute
            ? 'products'
            : isRecommendationsRoute
                ? 'recommendations'
                : isTipsRoute
                    ? 'tips'
                    : 'products';
    const bottomNavItems = [
        {
            label: 'Clients',
            value: 'clients',
            icon: 'clients' as const,
            href: '/clients',
        },
        // {
        //     label: 'Products',
        //     value: 'products',
        //     icon: 'products' as const,
        //     href: '/products',
        // },
        {
            label: 'Tips',
            value: 'tips',
            icon: 'tips' as const,
            href: '/tips',
        },
        {
            label: 'Recommendations',
            value: 'recommendations',
            icon: 'recommendation' as const,
            href: '/recommendations',
        },  
    ];

    return (
        <DesignSystem theme={theme as T_Theme} config={config}>
            <Feedback />
            <nav className="site-nav">
                <div className="nav-inner">
                    <ButtonBase onClick={handleHome} sx={{ borderRadius: 1, px: 0.5 }}>

                        <Image
                            src={`/askleida/svg/logo-dark.svg`}
                            alt="Leida"
                            width={110}
                            height={22}
                            className="logo" />
                        
                    </ButtonBase>
                        

                    <IconButton onClick={handleOpenSignoutConfirm}>
                        <Icon icon="signout" color="primary" />
                    </IconButton>
                </div>
            </nav>
            
            <main style={{ paddingBottom: 88 }}>
                <Container sx={{mt:3 }}>
                    <Box sx={{ 
                        mx: 3,
                        // border: '1px solid red',
                     }}>
                    {isClientNewRoute ? (
                        <ClientNew config={config} />
                    ) : isClientsRoute && clientId ? (
                        <ClientDetail config={config} client={selectedClient} avatarColor={avatarColor} />
                    ) : isClientsRoute ? (
                        <Clients />
                    ) : isTipNewRoute ? (
                        <TipNew config={config} />
                    ) : isTipsRoute && tipId ? (
                        <TipDetail config={config} tip={selectedTip} avatarColor={avatarColor} />
                    ) : isProductsRoute ? (
                        <Products />
                    ) : isTipsRoute ? (
                        <Tips />
                    ) : isRecommendationsRoute ? (
                        <Recommendations />
                    ) : (
                        <Box sx={{ minHeight: 'calc(100vh - 220px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Container maxWidth="xs">
                                <Stack alignItems="center" textAlign="center" spacing={2.5}>
                                    <Typography variant="h4" sx={{ my: 1 }}>
                                        {getTimeGreeting()},
                                    </Typography>

                                    
                                </Stack>
                            </Container>
                        </Box>
                    )}
                    </Box>
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
<Button
    variant="contained"
    startIcon={<Icon icon="recommendation" />}
    onClick={handleStart}
>
    Start a Recommendation
</Button>
*/