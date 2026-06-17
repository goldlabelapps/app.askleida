"use client";
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
    Box,
    Container,
} from '@mui/material';
import type { T_Theme } from '../NX/types';
import { useDispatch } from '../NX/Uberedux';
import { 
    DesignSystem, 
    Feedback, 
    setDesignSystem, 
    useDesignSystem,
    ConfirmAction,
    navigateTo,
} from '../NX/DesignSystem';
import {
    BottomNav,
    Clients,
    ClientDetail,
    ClientNew,
    Products,
    ProductDetail,
    ProductNew,
    TipDetail,
    TipNew,
    Account,
    Tips,
    Header,
    Greeting,
} from '../Leida';
import { initClients, useClients } from './components/Clients';
import { initProducts, useProducts } from './components/Products';
import { initTips, useTips } from './components/Tips';
import { setPaywall, useSupabaseAuth } from '../NX/Paywall';
import { supabase } from '../NX/lib/supabase';

const Leida: React.FC<any> = ({
    config,
}) => {
    
    const dispatch = useDispatch();
    const router = useRouter();
    const { user } = useSupabaseAuth();
    const pathname = usePathname();
    const clientsState = useClients();
    const productsState = useProducts();
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
        dispatch(navigateTo(router, '/'));
    };

    const handleOpenSignoutConfirm = () => setIsConfirmOpen(true);
    const handleCloseSignoutConfirm = () => setIsConfirmOpen(false);
    const routeParts = (pathname || '/').split('/').filter(Boolean);
    const isClientsRoute = routeParts[0] === 'clients';
    const isProductsRoute = routeParts[0] === 'products';
    const isAccountRoute = routeParts[0] === 'account';
    const isTipsRoute = routeParts[0] === 'tips';
    const isClientNewRoute = isClientsRoute && routeParts[1] === 'new';
    const isProductNewRoute = isProductsRoute && routeParts[1] === 'new';
    const isTipNewRoute = isTipsRoute && routeParts[1] === 'new';
    const clientId = isClientsRoute && routeParts[1] ? routeParts[1] : null;
    const productId = isProductsRoute && routeParts[1] ? routeParts[1] : null;
    const tipId = isTipsRoute && routeParts[1] ? routeParts[1] : null;
    const clientList = Array.isArray(clientsState?.list) ? clientsState.list : [];
    const productList = Array.isArray(productsState?.list) ? productsState.list : [];
    const tipList = Array.isArray(tipsState?.list) ? tipsState.list : [];
    const selectedClient = clientId
        ? clientList.find((client: any) => client?.client_id === clientId) || null
        : null;
    const selectedTip = tipId
        ? tipList.find((tip: any) => tip?.tip_id === tipId) || null
        : null;
    const selectedProduct = productId
        ? productList.find((product: any) => product?.product_id === productId) || null
        : null;

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

    React.useEffect(() => {
        if (isProductsRoute && !productsState?.initted && !productsState?.loading) {
            dispatch(initProducts());
        }
    }, [dispatch, isProductsRoute, user?.id, productsState?.initted, productsState?.loading]);

    const bottomNavValue = isClientsRoute
        ? 'clients'
        : isProductsRoute
            ? 'products'
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

        {
            label: 'Products',
            value: 'products',
            icon: 'products' as const,
            href: '/products',
        },
        
        {
            label: 'Tips',
            value: 'tips',
            icon: 'tips' as const,
            href: '/tips',
        },
    ];

    return (
        <DesignSystem theme={theme as T_Theme} config={config}>
            <Feedback />
            {/* Onboarding disabled pending further development */}
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
                    ) : isProductNewRoute ? (
                        <ProductNew config={config} />
                    ) : isProductsRoute && productId ? (
                        <ProductDetail config={config} product={selectedProduct} />
                    ) : isProductsRoute ? (
                        <Products />
                    ) : isTipNewRoute ? (
                        <TipNew config={config} />
                    ) : isTipsRoute && tipId ? (
                        <TipDetail tip={selectedTip} />
                    ) : isAccountRoute ? (
                        <Account />
                    ) : isTipsRoute ? (
                        <Tips />
                    ) : (
                        <Greeting />
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
