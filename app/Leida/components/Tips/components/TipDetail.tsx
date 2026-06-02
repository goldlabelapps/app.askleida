// TipDetail
"use client";
import React from 'react';
import type { T_Tip } from '../types';
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

type T_TipRecord = T_Tip & {
    tip_id?: string | null;
    title?: string | null;
    created?: string | null;
    updated?: string | null;
    data?: T_Tip | null;
};

type T_TipDetailProps = {
    config?: unknown;
    tip?: T_TipRecord | null;
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

const TipDetail: React.FC<T_TipDetailProps> = ({
    config,
    tip,
    avatarColor,
}) => {
    void config;

    const router = useRouter();
    const dispatch = useDispatch();
    const tipData = tip?.data ?? {};
    const firstName = getStringValue(tipData.first_name) || getStringValue(tip?.first_name) || '';
    const lastName = getStringValue(tipData.last_name) || getStringValue(tip?.last_name) || '';
    const fullName = `${firstName} ${lastName}`.trim() || getStringValue(tip?.title) || 'Unnamed tip';
    const email = getStringValue(tipData.email) || getStringValue(tip?.email) || '';
    const skinType = getStringValue(tipData.skin_type) || getStringValue(tip?.skin_type) || 'Not provided';
    const medication = getStringValue(tipData.current_medication) || getStringValue(tip?.current_medication) || 'Not provided';
    const personalNotes = getStringValue(tipData.personal_notes) || getStringValue(tip?.personal_notes) || 'Not provided';
    const skinOverview = getStringValue(tipData.skin_overview) || getStringValue(tip?.skin_overview) || 'Not provided';
    const dateOfBirth = tipData.date_of_birth ?? tip?.date_of_birth;
    const concernTags = getArrayValues(tipData.concern_tags ?? tip?.concern_tags);
    const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?';
    const tipId = getStringValue(tip?.tip_id) || getStringValue(tip?.id);

    if (!tip) {
        return <Alert severity="warning">Tip details are not available.</Alert>;
    }

    const handleDelete = () => {
        window.alert(`Delete tip placeholder for ${fullName}`);
    }

    const handleTipsNavigate = () => {
        dispatch(navigateTo(router, '/tips'));
    }

    const handleNew = () => {
        dispatch(navigateTo(router, '/tips/new'));
    };

    const handleCreateRecommendation = () => {
        const query = tipId ? `?tipId=${encodeURIComponent(tipId)}` : '';
        dispatch(navigateTo(router, `/recommendations${query}`));
    };

    return (
            <Box>
                <CardHeader
                    avatar={<>
                        <IconButton
                            color="primary"
                            onClick={handleTipsNavigate}
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
                        <DetailRow label="Pregnant" value={getBooleanLabel(tipData.is_pregnant ?? tip?.is_pregnant)} />
                        <DetailRow label="Breastfeeding" value={getBooleanLabel(tipData.is_breastfeeding ?? tip?.is_breastfeeding)} />
                        <DetailRow label="Current medication" value={medication} />
                    </List>
                    
                    
                    <Typography variant="h6">Record metadata</Typography>
                    <List disablePadding>
                        <DetailRow label="Created" value={formatDateTime(tip?.created ?? tip?.created_at)} />
                        <DetailRow label="Updated" value={formatDateTime(tip?.updated)} />
                        <DetailRow label="Imported from source" value={formatDateTime(tipData.source_created_at)} />
                        <DetailRow label="Source practitioner ID" value={getStringValue(tipData.source_practitioner_id) || 'Not provided'} />
                    </List>
                </CardContent>
                <CardActions>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button variant="text" onClick={handleTipsNavigate}>
                        Back to tips
                    </Button>
                </CardActions>
            </Box>
    );
};

export default TipDetail;
