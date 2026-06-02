// ClientDetail
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import {
    Alert,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    Stack,
    Typography,
} from '@mui/material';
import type { T_Client } from '../types';

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
}) => {
    void config;

    const router = useRouter();
    const clientData = client?.data ?? {};
    const firstName = getStringValue(clientData.first_name) || getStringValue(client?.first_name) || '';
    const lastName = getStringValue(clientData.last_name) || getStringValue(client?.last_name) || '';
    const fullName = `${firstName} ${lastName}`.trim() || getStringValue(client?.title) || 'Unnamed client';
    const email = getStringValue(clientData.email) || getStringValue(client?.email) || 'Not provided';
    const skinType = getStringValue(clientData.skin_type) || getStringValue(client?.skin_type) || 'Not provided';
    const medication = getStringValue(clientData.current_medication) || getStringValue(client?.current_medication) || 'Not provided';
    const personalNotes = getStringValue(clientData.personal_notes) || getStringValue(client?.personal_notes) || 'Not provided';
    const skinOverview = getStringValue(clientData.skin_overview) || getStringValue(client?.skin_overview) || 'Not provided';
    const dateOfBirth = clientData.date_of_birth ?? client?.date_of_birth;
    const concernTags = getArrayValues(clientData.concern_tags ?? client?.concern_tags);
    const clientId = getStringValue(client?.client_id) || getStringValue(client?.id) || 'Unknown client ID';

    if (!client) {
        return <Alert severity="warning">Client details are not available.</Alert>;
    }

    return (
        <Stack spacing={2}>

            <Card variant="outlined">
                <CardHeader
                    title={fullName}
                    subheader={`Client ID: ${clientId}`}
                />
                <CardActions>
                    <Button variant="outlined" onClick={() => router.push('/clients')}>
                        Back to clients
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => window.alert(`Create recommendation placeholder for ${fullName}`)}
                    >
                        Create recommendation
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => window.alert(`Delete client placeholder for ${fullName}`)}
                    >
                        Delete client
                    </Button>
                </CardActions>
                <Divider />
                <CardContent>
                    <Stack spacing={3}>
                        <Stack spacing={1}>
                            <Typography variant="h6">Profile</Typography>
                            <List disablePadding>
                                <DetailRow label="Email" value={email} />
                                <DetailRow label="Date of birth" value={formatDate(dateOfBirth)} />
                                <DetailRow label="Skin type" value={skinType} />
                                <DetailRow label="Pregnant" value={getBooleanLabel(clientData.is_pregnant ?? client?.is_pregnant)} />
                                <DetailRow label="Breastfeeding" value={getBooleanLabel(clientData.is_breastfeeding ?? client?.is_breastfeeding)} />
                                <DetailRow label="Current medication" value={medication} />
                            </List>
                        </Stack>

                        <Stack spacing={1}>
                            <Typography variant="h6">Concerns</Typography>
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
                        </Stack>

                        <Stack spacing={1}>
                            <Typography variant="h6">Notes</Typography>
                            <List disablePadding>
                                <DetailRow label="Skin overview" value={skinOverview} />
                                <DetailRow label="Personal notes" value={personalNotes} />
                            </List>
                        </Stack>

                        <Stack spacing={1}>
                            <Typography variant="h6">Record metadata</Typography>
                            <List disablePadding>
                                <DetailRow label="Created" value={formatDateTime(client?.created ?? client?.created_at)} />
                                <DetailRow label="Updated" value={formatDateTime(client?.updated)} />
                                <DetailRow label="Imported from source" value={formatDateTime(clientData.source_created_at)} />
                                <DetailRow label="Source practitioner ID" value={getStringValue(clientData.source_practitioner_id) || 'Not provided'} />
                            </List>
                        </Stack>
                    </Stack>
                </CardContent>
                <Divider />
                <CardActions>
                    <Button variant="text" onClick={() => router.push('/clients')}>
                        Back to clients
                    </Button>
                </CardActions>
            </Card>
        </Stack>
    );
};

export default ClientDetail;
