"use client";
import React from 'react';
import type { T_Client } from '../../../types';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
    Fab,
    CardActions,
    CardContent,
    CardHeader,
    Grid,
    Collapse,
    IconButton,
    ListItem,
    ListItemText,
    Stack,
    Paper,
    Typography,
} from '@mui/material';
import { Icon, navigateTo, ConfirmAction } from '../../../../NX/DesignSystem';
import { useDispatch } from '../../../../NX/Uberedux';
import { deleteClient, patchClient, Wrapper } from '../../../../Leida';
import { Editable } from '../../../../Leida';

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
};

const getStringValue = (value: unknown): string | null => {
    if (typeof value !== 'string') {
        return null;
    }

    return value || null;
};

const getBooleanValue = (value: unknown): boolean => {
    return value === true || value === 'true';
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

const SKIN_TYPE_OPTIONS = ['Dry', 'Oily', 'Combination', 'Normal'] as const;
const CONCERN_TAG_OPTIONS = ['acne', 'barrier damage', 'redness', 'pigmentation', 'dehydration', 'aging'] as const;

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
    const displayName = getStringValue(clientData.display_name) || '';
    const fullName = displayName || getStringValue(activeClient?.title) || 'Unnamed client';
    const email = getStringValue(clientData.email) || getStringValue(activeClient?.email) || '';
    const skinType = getStringValue(clientData.skin_type) || getStringValue(activeClient?.skin_type) || '';
    const medication = getStringValue(clientData.current_medication) || getStringValue(activeClient?.current_medication) || '';
    const personalNotes = getStringValue(clientData.personal_notes) || getStringValue(activeClient?.personal_notes) || '';
    const skinOverview = getStringValue(clientData.skin_overview) || getStringValue(activeClient?.skin_overview) || '';
    const dateOfBirth = getStringValue(clientData.date_of_birth ?? activeClient?.date_of_birth) || '';
    const isPregnant = getBooleanValue(clientData.is_pregnant ?? activeClient?.is_pregnant);
    const isBreastfeeding = getBooleanValue(clientData.is_breastfeeding ?? activeClient?.is_breastfeeding);
    const concernTags = getArrayValues(clientData.concern_tags ?? activeClient?.concern_tags);
    const clientId = getStringValue(activeClient?.client_id) || getStringValue(activeClient?.id);

    if (!activeClient) {
        if (isDeleting) {
            return null;
        }
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
        handleClientsNavigate();
    };

    const handlePatch = async () => {
        if (!draftClient || !clientId || !isDirty || isPatching) {
            return;
        }

        const draftData = getDataObject(draftClient.data);
        const normalizedDisplayName = getStringValue(draftData.display_name) || '';
        const normalizedEmail = getStringValue(draftData.email) || '';
        const normalizedDateOfBirth = getStringValue(draftData.date_of_birth) || '';
        const normalizedSkinType = getStringValue(draftData.skin_type) || '';
        const normalizedIsPregnant = getBooleanValue(draftData.is_pregnant);
        const normalizedIsBreastfeeding = getBooleanValue(draftData.is_breastfeeding);
        const normalizedCurrentMedication = getStringValue(draftData.current_medication) || '';
        const normalizedSkinOverview = getStringValue(draftData.skin_overview) || '';
        const normalizedPersonalNotes = getStringValue(draftData.personal_notes) || '';
        const normalizedConcernTags = Array.isArray(draftData.concern_tags)
            ? draftData.concern_tags.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
            : getStringValue(draftData.concern_tags)
                ? getStringValue(draftData.concern_tags)!.split(',').map((item) => item.trim()).filter((item) => item.length > 0)
                : [];
        const nextTitle = getStringValue(draftClient.title)
            || normalizedDisplayName
            || normalizedEmail
            || 'Client';

        setIsPatching(true);
        const success = await dispatch(patchClient(clientId, {
            title: nextTitle,
            email: normalizedEmail || null,
            date_of_birth: normalizedDateOfBirth || null,
            skin_type: normalizedSkinType || null,
            current_medication: normalizedCurrentMedication || null,
            skin_overview: normalizedSkinOverview || null,
            personal_notes: normalizedPersonalNotes || null,
            data: {
                ...draftData,
                display_name: normalizedDisplayName || null,
                email: normalizedEmail || null,
                date_of_birth: normalizedDateOfBirth || null,
                skin_type: normalizedSkinType || null,
                is_pregnant: normalizedIsPregnant,
                is_breastfeeding: normalizedIsBreastfeeding,
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

    const handleConcernTagsChange = (nextValue: string[]) => {
        setDraftClient((currentClient) => {
            if (!currentClient) {
                return currentClient;
            }

            const currentData = getDataObject(currentClient.data);

            return {
                ...currentClient,
                data: {
                    ...currentData,
                    concern_tags: nextValue,
                },
            };
        });
    };

    const handleBooleanDataChange = (key: 'is_pregnant' | 'is_breastfeeding', nextValue: boolean) => {
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

    return (
        <Wrapper>
            <Box>
                <CardHeader
                    avatar={<>
                        
                        <Button 
                            variant="outlined"
                            size="large"
                            startIcon={<Icon icon="left" />}
                            color="primary"
                            onClick={handleClientsNavigate}>
                            Clients
                        </Button>
                    </>}
                    action={<>
                        
                        <IconButton color="primary" onClick={handleOpenDeleteConfirm}>
                            <Icon icon="delete" />
                        </IconButton>
                    </>}
                />

                <CardContent>
                    <Typography variant="overline">
                        {email}
                    </Typography>
                    <Editable
                        label="Name"
                        variant="outlined"
                        value={displayName} 
                        placeholder="Display name" 
                        onChange={(value) => handleDataChange('display_name', value)} 
                    />
                    <Box sx={{ my: 2 }} />
                    <Editable 
                        label="Skin overview" 
                        value={skinOverview} 
                        multiline 
                        minRows={3} 
                        onChange={(value) => handleDataChange('skin_overview', value)}
                        sx={{ '& textarea': { lineHeight: 1.6 } }}
                    />
                    <Box sx={{ my: 2 }} />
                    {/* <pre>{JSON.stringify(draftClient, null, 2)}</pre> */}

                    {/* <Grid container spacing={4}>
                        <Grid size={{xs: 12, sm: 6}}>

                            <Editable 
                                label="Date of birth" 
                                value={dateOfBirth} 
                                editableType="date" 
                                onChange={(value) => handleDataChange('date_of_birth', value)} 
                            />

                           
                            
                            <Editable
                                variant="standard"
                                 label="Email" value={email} placeholder="Add email" onChange={(value) => handleDataChange('email', value)} />
                            <Box sx={{ my: 2 }} />
                            <Editable 
                            label="Current medication" value={medication} placeholder="Add current medication" multiline minRows={2} onChange={(value) => handleDataChange('current_medication', value)} sx={{ '& textarea': { lineHeight: 1.6 } }} />
                            <Box sx={{ my: 2 }} />
                            <Editable label="Skin overview" value={skinOverview} placeholder="Add skin overview" multiline minRows={3} onChange={(value) => handleDataChange('skin_overview', value)} sx={{ '& textarea': { lineHeight: 1.6 } }} />
                           
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                           
                            <Box sx={{mx: 1}}>
                                <Editable 
                                    label="Skin type" 
                                    value={skinType} 
                                    editableType="select" 
                                    variant="standard"
                                    placeholder="Select skin type" options={SKIN_TYPE_OPTIONS} 
                                    onChange={(value) => handleDataChange('skin_type', value)} />
                                <Box sx={{ my: 2 }} />
                            
                            
                            </Box>
                            <Box sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, px: 1.5 }}>
                                <Editable label="Pregnant" value={isPregnant} onChange={(value) => handleBooleanDataChange('is_pregnant', value === true)} />
                                <Editable label="Breastfeeding" value={isBreastfeeding} onChange={(value) => handleBooleanDataChange('is_breastfeeding', value === true)} />
                            </Box>
                            
                            <Box sx={{ my: 2 }} />

                            <Editable value={concernTags} editableType="chips" options={CONCERN_TAG_OPTIONS} onChange={handleConcernTagsChange} />
                            
                            <Box sx={{ my: 2 }} />
                            
                            <Editable label="Personal notes" value={personalNotes} placeholder="Add personal notes" multiline minRows={3} onChange={(value) => handleDataChange('personal_notes', value)} sx={{ '& textarea': { lineHeight: 1.6 } }} />
                            
                        </Grid>
                    </Grid> */}
                </CardContent>
                <CardActions sx={{ display: 'block', width: '100%' }}>
                    <Collapse in={isDirty} unmountOnExit>
                        <Box sx={{ mx: 1}}>
                            <Button
                                size="large"
                                fullWidth
                                endIcon={<Icon icon="save" />}
                                variant="contained"
                                color="primary"
                                disabled={isPatching}
                                onClick={handlePatch}>
                                Save Changes
                            </Button>
                        </Box>
                    </Collapse>
                </CardActions>


                <ConfirmAction
                    open={confirmOpen}
                    icon="delete"
                    title="Delete Client?"
                    body="Are you sure you want to delete this client? This action cannot be undone."
                    handleConfirm={handleDelete}
                    handleClose={handleCloseDeleteConfirm}
                />
            </Box>
        </Wrapper>
    );
};

export default ClientDetail;
