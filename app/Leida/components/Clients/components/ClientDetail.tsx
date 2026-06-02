// ClientDetail
"use client";
import React from 'react';
// import Image from 'next/image';
// import { usePathname } from 'next/navigation';
// import {
//     IconButton,
//     Container,
// } from '@mui/material';
// import type { T_Theme } from '../NX/types';
// import { useDispatch } from '../NX/Uberedux';
// import { 
//     DesignSystem, 
//     Feedback, 
//     setDesignSystem, 
//     useDesignSystem,
//     Icon,
//     ConfirmAction,
// } from '../NX/DesignSystem';


const ClientDetail: React.FC<any> = ({
    config,
    client,
}) => {
    
    return (
        <>
            <pre>{JSON.stringify(client || null, null, 2)}</pre>
        </>
    );
};

export default ClientDetail;
