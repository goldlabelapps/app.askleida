// ClientDetail
"use client";
import React from 'react';
import type { T_Client } from '../types';
import { useRouter } from 'next/navigation';
import {
    Box,
    Alert,
    Avatar,
    Button,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    Stack,
    IconButton,
    Typography,
} from '@mui/material';
import { Icon, navigateTo } from '../../../../NX/DesignSystem';
import { useDispatch } from '../../../../NX/Uberedux';

type T_ClientRecord = T_Client & {
    client_id?: string | null;
    title?: string | null;
    created?: string | null;
    updated?: string | null;
    data?: T_Client | null;
};

type T_ClientDetailProps = {
    config?: unknown;
    client?: T_ClientRecord | null;
    avatarColor?: string;
};

const getStringValue = (value: unknown): string | null => {
    if (typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim();
    return trimmed ? trimmed : null;
};

const getBooleanLabel = (value: unknown): string => {
    if (value === true || value === 'true') {
        return 'Yes';
    }

    if (value === false || value === 'false') {
        return 'No';
    }

    return 'Not provided';
};

const formatDateTime = (value: unknown): string => {
    const stringValue = getStringValue(value);

    if (!stringValue) {
        return 'Not provided';
    }

    const date = new Date(stringValue);
    if (Number.isNaN(date.getTime())) {
        return stringValue;
    }

    return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
};

const formatDate = (value: unknown): string => {
    const stringValue = getStringValue(value);

    if (!stringValue) {
        return 'Not provided';
    }

    const date = new Date(stringValue);
    if (Number.isNaN(date.getTime())) {
        return stringValue;
    }

    return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'long',
    }).format(date);
};

const getArrayValues = (value: unknown): string[] => {
    if (Array.isArray(value)) {
        return value
            .map((item) => getStringValue(item))
            .filter((item): item is string => Boolean(item));
    }

    const stringValue = getStringValue(value);
    return stringValue ? [stringValue] : [];
};

const DetailRow = ({
    label,
    value,
}: {
    label: string;
    value: string;
}) => (
    <ListItem divider>
        <ListItemText primary={label} secondary={value} />
    </ListItem>
);

const ClientDetail: React.FC<T_ClientDetailProps> = ({
    config,
    client,
    avatarColor,
}) => {
    void config;

    const router = useRouter();
    const dispatch = useDispatch();
    const clientData = client?.data ?? {};
    const firstName = getStringValue(clientData.first_name) || getStringValue(client?.first_name) || '';
    const lastName = getStringValue(clientData.last_name) || getStringValue(client?.last_name) || '';
    const fullName = `${firstName} ${lastName}`.trim() || getStringValue(client?.title) || 'Unnamed client';
    const email = getStringValue(clientData.email) || getStringValue(client?.email) || '';
    const skinType = getStringValue(clientData.skin_type) || getStringValue(client?.skin_type) || 'Not provided';
    const medication = getStringValue(clientData.current_medication) || getStringValue(client?.current_medication) || 'Not provided';
    const personalNotes = getStringValue(clientData.personal_notes) || getStringValue(client?.personal_notes) || 'Not provided';
    const skinOverview = getStringValue(clientData.skin_overview) || getStringValue(client?.skin_overview) || 'Not provided';
    const dateOfBirth = clientData.date_of_birth ?? client?.date_of_birth;
    const concernTags = getArrayValues(clientData.concern_tags ?? client?.concern_tags);
    const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?';
    const clientId = getStringValue(client?.client_id) || getStringValue(client?.id);

    if (!client) {
        return <Alert severity="warning">Client details are not available.</Alert>;
    }

    const handleDelete = () => {
        window.alert(`Delete client placeholder for ${fullName}`);
    }

    const handleClientsNavigate = () => {
        dispatch(navigateTo(router, '/clients'));
    }

    const handleNew = () => {
        dispatch(navigateTo(router, '/clients/new'));
    };

    const handleCreateRecommendation = () => {
        const query = clientId ? `?clientId=${encodeURIComponent(clientId)}` : '';
        dispatch(navigateTo(router, `/recommendations${query}`));
    };

    return (
            <Box>
                <CardHeader
                    avatar={<>
                        <IconButton
                            color="primary"
                            onClick={handleClientsNavigate}
                        >
                            <Icon icon="left" />
                        </IconButton>

                        <Avatar
                            sx={{
                                bgcolor: avatarColor || '#e2e8f0',
                                color: '#000',
                            }}
                        >
                            <Typography>
                                {initials}
                            </Typography>
                        </Avatar>
                    </>
                }
                title={<Typography variant="subtitle1">{fullName}</Typography>}
                    subheader={email}
                    action={<>
                        <IconButton
                            color="primary"
                            onClick={handleDelete}
                        >
                            <Icon icon="delete" />
                        </IconButton>
                        
                        <IconButton
                            color="primary"
                            onClick={handleNew}
                        >
                            <Icon icon="new" />
                        </IconButton>

                        {/* <IconButton
                            color="primary"
                            onClick={handleCreateRecommendation}
                        >
                            <Icon icon="recommendation" />
                        </IconButton> */}

                    </>}
                />
                
                <CardContent>
                    
                    {concernTags.length ? (
                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                            {concernTags.map((tag) => (
                                <Chip key={tag} label={tag} />
                            ))}
                        </Stack>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No concern tags recorded.
                        </Typography>
                    )}
                <List disablePadding>
                    <DetailRow label="Skin overview" value={skinOverview} />
                    
                    
                    <DetailRow label="Personal notes" value={personalNotes} />

                        <DetailRow label="Email" value={email} />
                        <DetailRow label="Date of birth" value={formatDate(dateOfBirth)} />
                        <DetailRow label="Skin type" value={skinType} />
                        <DetailRow label="Pregnant" value={getBooleanLabel(clientData.is_pregnant ?? client?.is_pregnant)} />
                        <DetailRow label="Breastfeeding" value={getBooleanLabel(clientData.is_breastfeeding ?? client?.is_breastfeeding)} />
                        <DetailRow label="Current medication" value={medication} />
                    </List>
                    
                    
                    <Typography variant="h6">Record metadata</Typography>
                    <List disablePadding>
                        <DetailRow label="Created" value={formatDateTime(client?.created ?? client?.created_at)} />
                        <DetailRow label="Updated" value={formatDateTime(client?.updated)} />
                        <DetailRow label="Imported from source" value={formatDateTime(clientData.source_created_at)} />
                        <DetailRow label="Source practitioner ID" value={getStringValue(clientData.source_practitioner_id) || 'Not provided'} />
                    </List>
                </CardContent>
                <CardActions>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button variant="text" onClick={handleClientsNavigate}>
                        Back to clients
                    </Button>
                </CardActions>
            </Box>
    );
};

export default ClientDetail;
