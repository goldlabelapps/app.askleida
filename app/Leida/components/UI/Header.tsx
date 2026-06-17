"use client";
import React from 'react';
import { Account } from '../Account';
import Image from 'next/image';
import { Box, ButtonBase } from '@mui/material';
// import { Icon } from '../../../NX/DesignSystem';

type T_HeaderProps = {
    onHome: () => void;
};

const Header: React.FC<T_HeaderProps> = ({
    onHome,
}) => {
    return (
        <nav className="site-nav">
            <div className="nav-inner">
                <ButtonBase onClick={onHome} sx={{ borderRadius: 1, px: 0.5 }}>
                    <Image
                        src={'/askleida/svg/logo-dark.svg'}
                        alt="Leida"
                        width={110}
                        height={22}
                        className="logo"
                    />
                </ButtonBase>
                <Box sx={{height: 46 }}>
                    <Account />
                </Box>
            </div>
        </nav>
    );
};

export default Header;