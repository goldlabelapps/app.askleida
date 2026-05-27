"use client";
import pJSON from '../../../../package.json'
import { I_Nav, I_NavNode } from '../../types';
import React from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/navigation';
import {
    Box,
    List,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Typography,
} from '@mui/material';
import { 
    Icon, 
    setDesignSystem, 
    useDesignSystem, 
    TreeNav,
} from '../../DesignSystem';
import { useDispatch } from '../../Uberedux';
import { Share } from '../../../Virus';
import { SignOutBtn } from '../../Paywall';

function sortNavItems(items: any[]) {
    return [...items].sort((a, b) => {
        const orderA = typeof a.order === "number" ? a.order : 9999;
        const orderB = typeof b.order === "number" ? b.order : 9999;
        if (orderA !== orderB) return orderA - orderB;
        return a.title.localeCompare(b.title);
    });
}

const Nav: React.FC<I_Nav> = ({
    navItems,
    mode = 'desktop',
}) => {

    const router = useRouter();
    const sortedNavItems = sortNavItems(navItems);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const dispatch = useDispatch();
    const designSystem = useDesignSystem();
    const currentThemeMode = designSystem?.themeMode ?? 'light';
    const { themeSwitching } = designSystem || {};
    const { sharing } = designSystem || {};

    const handleThemeModeToggle = () => {
        const nextMode = currentThemeMode === 'light' ? 'dark' : 'light';
        dispatch(setDesignSystem('themeMode', nextMode));
        setDrawerOpen(false);
    }

    const { navigateTo } = require('../../../NX/DesignSystem');

    function handleNavClick(slug?: string) {
        if (typeof slug === 'string' && slug.trim().length > 0) {
            router.push(slug);
            setDrawerOpen(false);
        } else {
            console.log('No valid slug for nav item:', slug);
        }
    }

    function renderNavItems(
        items: I_NavNode[],
        parentKey = '',
    ): React.ReactNode {

        return items
            .map((item, i) => {
                const key = `${parentKey}item_${i}`;
                const hasChildren = Array.isArray(item.children) && item.children.length > 0;
                const navTarget = (typeof item.slug === 'string' && item.slug.trim().length > 0)
                    ? item.slug
                    : (typeof (item as any).path === 'string' && (item as any).path.trim().length > 0 ? (item as any).path : undefined);
                const isRoutable = typeof navTarget === 'string' && navTarget.trim().length > 0;
                const label = navTarget === '/' ? 'Home' : item.title;

                const icon = item.icon || 'settings';
                let filteredChildren = item.children;
                if (hasChildren && item.path) {
                    filteredChildren = item.children!.filter(child => child.path !== item.path);
                }
                return (
                    <Box key={key}>              
                        <ListItemButton
                            onClick={isRoutable ? (e) => {
                                e.preventDefault();
                                handleNavClick(navTarget);
                            } : undefined}
                            disabled={!isRoutable}
                            sx={!isRoutable ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                        >
                            <ListItemIcon>
                                <Icon icon={icon as any} color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={label} />
                            
                        </ListItemButton>
                        {hasChildren && filteredChildren && filteredChildren.length > 0 && (
                            <List sx={{ ml: 2 }}>
                                {renderNavItems(sortNavItems(filteredChildren), key + '_')}
                            </List>
                        )}
                    </Box>
                );
            })
            .filter(Boolean);
    }
    
    if (mode === 'mobile') {
        return (
            <>
                {!drawerOpen && (
                    <IconButton
                        color="primary"
                        onClick={() => setDrawerOpen(true)} aria-label="Open Menu">
                        <Icon icon='menu' />
                    </IconButton>
                )}

                <Drawer
                    anchor="bottom"
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    sx={{
                        zIndex: (theme) => (theme.zIndex?.modal ?? 1300) + 200,
                    }}>

                    {sharing && <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Share size="small" />
                    </Box>}
                    
                    <Box
                        role="presentation"
                        sx={{
                            height: '100vh',
                            display: 'flex',
                            flexDirection: 'column',
                            p: 1,
                            minWidth: 310,
                        }}>
                        <Box sx={{ flexGrow: 1 }} />
                        <TreeNav navItems={navItems}/>
                        <Box sx={{ mt: 'auto', display: 'flex' }}>

                            <Box sx={{ mt: 3, ml: 3 }}>
                                <Typography variant='body2'>
                                    vs {pJSON.version}
                                </Typography>
                            </Box>

                            <Box sx={{ flexGrow: 1 }} />
                            
                            {themeSwitching && <>
                                <Box sx={{ pb: 1.5, ml:2 }}>
                                    <IconButton onClick={handleThemeModeToggle}>
                                        <Icon icon={currentThemeMode === 'light' ? 'darkmode' : 'lightmode'} color="primary" />
                                    </IconButton>
                                </Box>
                            </>}
                            
                        </Box>
                        
                    </Box>
                </Drawer>
            </>
        );
    }

    return (
        <Box>
            <List component={'nav'}>
                {renderNavItems(sortedNavItems)}
            </List>
        </Box>
    );
};

export default Nav;
