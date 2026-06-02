"use client";
import React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    IconButton,
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
import {BottomNav} from '../Leida';
import { setPaywall } from '../NX/Paywall';
import { supabase } from '../NX/lib/supabase';


const Leida: React.FC<any> = ({
    children,
    config,
}) => {
    
    const dispatch = useDispatch();
    const pathname = usePathname();
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
    const bottomNavValue = pathname === '/' ? 'home' : pathname;
    const bottomNavItems = [
        {
            label: 'Home',
            value: 'home',
            icon: 'home' as const,
            href: '/',
        },
        {
            label: 'Sign out',
            value: 'signout',
            icon: 'signout' as const,
            onClick: handleOpenSignoutConfirm,
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
                {children}
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