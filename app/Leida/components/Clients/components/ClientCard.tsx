"use client";
import React from 'react';
import { ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
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
        <ListItem key={itemKey} disablePadding>
            <ListItemButton
                disabled={!clientId}
                onClick={() => {
                    if (clientId) {
                        onClick?.(clientId);
                    }
                }}
            >
                <ListItemText
                    primary={<Typography variant="subtitle1">{fullName}</Typography>}
                    secondary={subheader}
                />
            </ListItemButton>
        </ListItem>
    );
};

export default ClientCard;