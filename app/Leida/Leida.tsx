"use client";
import React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    IconButton,
    Container,
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
} from '../NX/DesignSystem';
import {
    BottomNav,
    Clients,
    ClientDetail,
} from '../Leida';
import { initClients, useClients } from './components/Clients';
import { setPaywall } from '../NX/Paywall';
import { supabase } from '../NX/lib/supabase';


const Leida: React.FC<any> = ({
    config,
}) => {
    
    const dispatch = useDispatch();
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

    const handleOpenSignoutConfirm = () => setIsConfirmOpen(true);
    const handleCloseSignoutConfirm = () => setIsConfirmOpen(false);
    const routeParts = (pathname || '/').split('/').filter(Boolean);
    const isHomeRoute = routeParts.length === 0;
    const isClientsRoute = routeParts[0] === 'clients';
    const clientId = isClientsRoute && routeParts[1] ? routeParts[1] : null;
    const clientList = Array.isArray(clientsState?.list) ? clientsState.list : [];
    const selectedClient = clientId
        ? clientList.find((client: any) => client?.client_id === clientId) || null
        : null;

    React.useEffect(() => {
        if (isClientsRoute && !clientsState?.initted) {
            dispatch(initClients());
        }
    }, [dispatch, isClientsRoute, clientsState?.initted]);

    const bottomNavValue = isHomeRoute ? 'home' : (isClientsRoute ? 'clients' : pathname);
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
            label: 'Debug',
            value: 'debug',
            icon: 'bug' as const,
            href: '/debug',
        },
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
                    {isHomeRoute ? (
                        <>
                            home
                        </>
                    ) : isClientsRoute && clientId ? (
                        <ClientDetail config={config} client={selectedClient} />
                    ) : isClientsRoute ? (
                        <Clients />
                    ) : (
                        <>
                            home
                        </>
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