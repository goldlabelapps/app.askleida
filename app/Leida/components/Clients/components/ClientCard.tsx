"use client";
import React from 'react';
import { Avatar, Box, ButtonBase, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import type { T_Client } from '../types';
import { ageFromDoB } from '../../../../Leida';

type T_ClientCardProps = {
    client: T_Client;
    onClick?: (clientId: string) => void;
};

const getText = (value: unknown): string => {
    return typeof value === 'string' ? value.trim() : '';
};

const getClientId = (client: T_Client): string => {
    return getText(client.client_id) || getText(client.id);
};

const getClientName = (client: T_Client): string => {
    const data = client?.data && typeof client.data === 'object' ? client.data : null;
    const firstName = getText(data?.first_name) || getText(client.first_name);
    const lastName = getText(data?.last_name) || getText(client.last_name);
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || 'Unnamed client';
};

const getClientSubheader = (client: T_Client): string => {
    const data = client?.data && typeof client.data === 'object' ? client.data : null;
    const dateOfBirth = getText(data?.date_of_birth) || getText(client.date_of_birth);
    return dateOfBirth ? ageFromDoB(dateOfBirth) : 'no date of birth';
};

const ClientCard: React.FC<T_ClientCardProps> = ({ client, onClick }) => {
    const clientId = getClientId(client);
    const fullName = getClientName(client);
    const subheader = getClientSubheader(client);
    const itemKey = clientId || fullName;

    return (
        <>
            <nav className="site-nav">
                <div className="nav-inner">
                    <ButtonBase  
                        disabled={!clientId}
                        onClick={() => {
                            if (clientId) {
                                onClick?.(clientId);
                            }
                        }} 
                        sx={{ borderRadius: 1, px: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <Box>
                                    <Avatar />
                                </Box>
                                <Box sx={{ flex: 1, ml: 2 }}>
                                    <Typography variant="subtitle1">{fullName}</Typography>
                                </Box>
                            </Box>
                    </ButtonBase>
                </div>
            </nav>
        </>
       
    );
};

export default ClientCard;