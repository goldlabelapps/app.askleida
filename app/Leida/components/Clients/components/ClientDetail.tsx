"use client";
import React from 'react';
import type { T_Client } from '../types';
import { useRouter } from 'next/navigation';
import {
    Box,
    Avatar,
    Button,
    CardActions,
    CardContent,
    CardHeader,
    CircularProgress,
    Collapse,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Stack,
    Typography,
} from '@mui/material';
import { Icon, navigateTo, ConfirmAction } from '../../../../NX/DesignSystem';
import { useDispatch } from '../../../../NX/Uberedux';
import { deleteClient, patchClient } from '../../Clients';
import { EditableText } from '../../../../Leida';

type T_ClientRecord = T_Client & {
    client_id?: string | null;
    title?: string | null;
    created?: string | null;
    updated?: string | null;
    data?: T_Client['data'] | null;
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

const getDataObject = (value: unknown): Record<string, unknown> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    return value as Record<string, unknown>;
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

const cloneClient = (value: T_ClientRecord | null | undefined): T_ClientRecord | null => {
    if (!value) {
        return null;
    }

    return JSON.parse(JSON.stringify(value)) as T_ClientRecord;
};

const areClientsEqual = (left: T_ClientRecord | null, right: T_ClientRecord | null): boolean => {
    if (!left && !right) {
        return true;
    }

    if (!left || !right) {
        return false;
    }

    return JSON.stringify(left) === JSON.stringify(right);
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
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [isPatching, setIsPatching] = React.useState(false);
    const [originalClient, setOriginalClient] = React.useState<T_ClientRecord | null>(cloneClient(client));
    const [draftClient, setDraftClient] = React.useState<T_ClientRecord | null>(cloneClient(client));

    React.useEffect(() => {
        const nextClient = cloneClient(client);
        setOriginalClient(nextClient);
        setDraftClient(nextClient);
    }, [client]);

    const isDirty = !areClientsEqual(originalClient, draftClient);
    const activeClient = draftClient ?? client ?? null;
    const clientData = getDataObject(activeClient?.data);
    const firstName = getStringValue(clientData.first_name) || getStringValue(activeClient?.first_name) || '';
    const lastName = getStringValue(clientData.last_name) || getStringValue(activeClient?.last_name) || '';
    const fullName = `${firstName} ${lastName}`.trim() || getStringValue(activeClient?.title) || 'Unnamed client';
    const email = getStringValue(clientData.email) || getStringValue(activeClient?.email) || '';
    const skinType = getStringValue(clientData.skin_type) || getStringValue(activeClient?.skin_type) || '';
    const medication = getStringValue(clientData.current_medication) || getStringValue(activeClient?.current_medication) || '';
    const personalNotes = getStringValue(clientData.personal_notes) || getStringValue(activeClient?.personal_notes) || '';
    const skinOverview = getStringValue(clientData.skin_overview) || getStringValue(activeClient?.skin_overview) || '';
    const dateOfBirth = getStringValue(clientData.date_of_birth ?? activeClient?.date_of_birth) || '';
    const concernTags = getArrayValues(clientData.concern_tags ?? activeClient?.concern_tags);
    const concernTagsText = concernTags.join(', ');
    const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?';
    const clientId = getStringValue(activeClient?.client_id) || getStringValue(activeClient?.id);

    if (!activeClient) {
        return null;
    }

    const handleClientsNavigate = () => {
        dispatch(navigateTo(router, '/clients'));
    };

    const handleNew = () => {
        dispatch(navigateTo(router, '/clients/new'));
    };

    const handleOpenDeleteConfirm = () => {
        setConfirmOpen(true);
    };

    const handleCloseDeleteConfirm = () => {
        setConfirmOpen(false);
    };

    const handleDelete = async () => {
        if (!clientId) {
            setConfirmOpen(false);
            return;
        }

        setIsDeleting(true);
        setConfirmOpen(false);
        await dispatch(deleteClient(clientId));
        setIsDeleting(false);
        handleClientsNavigate();
    };

    const handlePatch = async () => {
        if (!draftClient || !clientId || !isDirty || isPatching) {
            return;
        }

        const draftData = getDataObject(draftClient.data);
        const normalizedFirstName = getStringValue(draftData.first_name) || '';
        const normalizedLastName = getStringValue(draftData.last_name) || '';
        const normalizedEmail = getStringValue(draftData.email) || '';
        const normalizedDateOfBirth = getStringValue(draftData.date_of_birth) || '';
        const normalizedSkinType = getStringValue(draftData.skin_type) || '';
        const normalizedCurrentMedication = getStringValue(draftData.current_medication) || '';
        const normalizedSkinOverview = getStringValue(draftData.skin_overview) || '';
        const normalizedPersonalNotes = getStringValue(draftData.personal_notes) || '';
        const normalizedConcernTags = Array.isArray(draftData.concern_tags)
            ? draftData.concern_tags.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
            : getStringValue(draftData.concern_tags)
                ? getStringValue(draftData.concern_tags)!.split(',').map((item) => item.trim()).filter((item) => item.length > 0)
                : [];
        const nextTitle = getStringValue(draftClient.title)
            || [normalizedFirstName, normalizedLastName].filter(Boolean).join(' ')
            || normalizedEmail
            || 'Client';

        setIsPatching(true);
        const success = await dispatch(patchClient(clientId, {
            title: nextTitle,
            first_name: normalizedFirstName || null,
            last_name: normalizedLastName || null,
            email: normalizedEmail || null,
            date_of_birth: normalizedDateOfBirth || null,
            skin_type: normalizedSkinType || null,
            current_medication: normalizedCurrentMedication || null,
            skin_overview: normalizedSkinOverview || null,
            personal_notes: normalizedPersonalNotes || null,
            data: {
                ...draftData,
                first_name: normalizedFirstName || null,
                last_name: normalizedLastName || null,
                email: normalizedEmail || null,
                date_of_birth: normalizedDateOfBirth || null,
                skin_type: normalizedSkinType || null,
                concern_tags: normalizedConcernTags,
                current_medication: normalizedCurrentMedication || null,
                skin_overview: normalizedSkinOverview || null,
                personal_notes: normalizedPersonalNotes || null,
            },
        }));
        setIsPatching(false);

        if (success) {
            handleClientsNavigate();
        }
    };

    const handleTitleChange = (nextTitle: string) => {
        setDraftClient((currentClient) => {
            if (!currentClient) {
                return currentClient;
            }

            return {
                ...currentClient,
                title: nextTitle,
            };
        });
    };

    const handleDataChange = (key: string, nextValue: string) => {
        setDraftClient((currentClient) => {
            if (!currentClient) {
                return currentClient;
            }

            const currentData = getDataObject(currentClient.data);

            return {
                ...currentClient,
                data: {
                    ...currentData,
                    [key]: nextValue,
                },
            };
        });
    };

    const handleConcernTagsChange = (nextValue: string) => {
        setDraftClient((currentClient) => {
            if (!currentClient) {
                return currentClient;
            }

            const currentData = getDataObject(currentClient.data);
            const nextTags = nextValue
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0);

            return {
                ...currentClient,
                data: {
                    ...currentData,
                    concern_tags: nextTags,
                },
            };
        });
    };

    return (
        <Box>
            <CardHeader
                avatar={<>
                    <IconButton color="primary" onClick={handleClientsNavigate}>
                        <Icon icon="left" />
                    </IconButton>
                    <Avatar
                        sx={{
                            bgcolor: avatarColor || '#e2e8f0',
                            color: '#000',
                        }}
                    >
                        <Typography>{initials}</Typography>
                    </Avatar>
                </>}
                title={<Typography variant="subtitle1">{fullName}</Typography>}
                subheader={email || 'No email provided'}
                action={<>
                    <IconButton color="primary" onClick={handleOpenDeleteConfirm} disabled={isDeleting}>
                        <Icon icon="delete" />
                    </IconButton>
                    <IconButton color="primary" onClick={handleNew}>
                        <Icon icon="new" />
                    </IconButton>
                </>}
            />

            <CardContent>
                <Stack spacing={2}>
                    <EditableText
                        label="Title"
                        value={getStringValue(activeClient.title) || ''}
                        placeholder="Add title"
                        onChange={handleTitleChange}
                    />
                    <EditableText label="First name" value={firstName} placeholder="Add first name" onChange={(value) => handleDataChange('first_name', value)} />
                    <EditableText label="Last name" value={lastName} placeholder="Add last name" onChange={(value) => handleDataChange('last_name', value)} />
                    <EditableText label="Email" value={email} placeholder="Add email" onChange={(value) => handleDataChange('email', value)} />
                    <EditableText label="Date of birth" value={dateOfBirth} placeholder="YYYY-MM-DD" onChange={(value) => handleDataChange('date_of_birth', value)} />
                    <EditableText label="Skin type" value={skinType} placeholder="Add skin type" onChange={(value) => handleDataChange('skin_type', value)} />
                    <EditableText label="Concern tags" value={concernTagsText} placeholder="Acne, dryness, sensitivity" onChange={handleConcernTagsChange} />
                    <EditableText label="Current medication" value={medication} placeholder="Add current medication" multiline minRows={2} onChange={(value) => handleDataChange('current_medication', value)} />
                    <EditableText label="Skin overview" value={skinOverview} placeholder="Add skin overview" multiline minRows={3} onChange={(value) => handleDataChange('skin_overview', value)} />
                    <EditableText label="Personal notes" value={personalNotes} placeholder="Add personal notes" multiline minRows={3} onChange={(value) => handleDataChange('personal_notes', value)} />

                    <Collapse in={isDirty} unmountOnExit>
                        <Button
                            fullWidth
                            startIcon={isPatching ? <CircularProgress size={16} color="inherit" /> : <Icon icon="save" />}
                            variant="contained"
                            disabled={isPatching}
                            onClick={handlePatch}
                            sx={{ mt: 2 }}
                        >
                            Save
                        </Button>
                    </Collapse>

                    <Typography variant="h6">Record metadata</Typography>
                    <List disablePadding>
                        <DetailRow label="Created" value={formatDateTime(activeClient?.created ?? activeClient?.created_at)} />
                        <DetailRow label="Updated" value={formatDateTime(activeClient?.updated)} />
                        <DetailRow label="Imported from source" value={formatDateTime(clientData.source_created_at)} />
                        <DetailRow label="Source practitioner ID" value={getStringValue(clientData.source_practitioner_id) || 'Not provided'} />
                        <DetailRow label="Pregnant" value={getBooleanLabel(clientData.is_pregnant ?? activeClient?.is_pregnant)} />
                        <DetailRow label="Breastfeeding" value={getBooleanLabel(clientData.is_breastfeeding ?? activeClient?.is_breastfeeding)} />
                    </List>
                </Stack>
            </CardContent>

            <CardActions>
                <Button startIcon={<Icon icon="delete" />} color="error" onClick={handleOpenDeleteConfirm} disabled={isDeleting}>
                    Delete
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button variant="text" onClick={handleClientsNavigate}>
                    Back to clients
                </Button>
            </CardActions>

            <ConfirmAction
                open={confirmOpen}
                icon="delete"
                title="Delete client?"
                body={`Are you sure you want to delete ${fullName}? This action cannot be undone.`}
                handleConfirm={handleDelete}
                handleClose={handleCloseDeleteConfirm}
            />
        </Box>
    );
};

export default ClientDetail;
