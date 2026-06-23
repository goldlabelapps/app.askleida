'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
    Box,
    Button,
} from '@mui/material';
import { useDispatch } from '../../../NX/Uberedux';
import { Icon, navigateTo } from '../../../NX/DesignSystem';
import { 
    ClientList, 
    Wrapper,
} from '../../../Leida';

export default function Clients() {

    const router = useRouter();
    const dispatch = useDispatch();
    
    const handleClientNew = () => {
        dispatch(navigateTo(router, '/clients/new'));
    };

    return (<>
                <Wrapper>
                    <ClientList />
                </Wrapper>
            </>
    );
}
