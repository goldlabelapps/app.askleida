"use client";
import React from 'react';
import { 
   Box,
} from '@mui/material';
import type { T_Client } from '../../../types';

export type I_RenderClient = {
    client: T_Client;
};

const RenderClient: React.FC<I_RenderClient> = ({ 
    client,
}) => {

    return (
        <Box sx={{ border: '1pd solid red'}}>
            <pre>client: {JSON.stringify(client, null, 2)}</pre>
        </Box>
    );
};

export default RenderClient;