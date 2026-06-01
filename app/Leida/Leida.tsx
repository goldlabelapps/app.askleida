"use client";
import React from 'react';
import type { T_Theme } from '../NX/types';
import { useDispatch } from '../NX/Uberedux';
import { 
    DesignSystem, 
    Feedback, 
    setDesignSystem, 
    useDesignSystem,
} from '../NX/DesignSystem';

const Leida: React.FC<any> = ({
    children,
    config,
}) => {
    
    const dispatch = useDispatch();
    const designSystem = useDesignSystem();
    const defaultTheme = config?.cartridges?.designSystem?.defaultTheme;
    const themeSwitching = config?.cartridges?.designSystem?.themeSwitching;
    const themeMode = designSystem?.themeMode || defaultTheme;

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

    return (
        <DesignSystem theme={theme as T_Theme} config={config}>
            <Feedback />
            {children}
        </DesignSystem>
    );
};

export default Leida;

/*
<nav className="site-nav">
    <div className="nav-inner">
        <a href="/" className="logo-link">
            <Image
                src={`${assets}/logo-dark.svg`}
                alt="Leida"
                width={110}
                height={22}
                className="logo" />
        </a>

        icon
    </div>
</nav>
*/