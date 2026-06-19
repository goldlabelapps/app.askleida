"use client";
import React from 'react';
import { 
   Box,
} from '@mui/material';
import type { T_Client } from '../../../types';

export type I_RenderClient = {
    client: T_Client;
    mode?: 'list' | 'detail';
};

const RenderClient: React.FC<I_RenderClient> = ({ 
    client,
    mode = 'list',
}) => {

    return (
        <Box sx={{ border: '1px solid green', p: 1, my: 1 }}>
            <pre>client: {JSON.stringify(client, null, 2)}</pre>
        </Box>
    );
};

export default RenderClient;