'use client';
import React, { useState, useRef } from 'react';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    Box,
    Typography,
    Grid,
    Divider,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    List,
    ListItemButton,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import { Icon, navigateTo } from '../../../../../DesignSystem';
import { useDispatch } from '../../../../../Uberedux';
import { formatDeviceSummary, formatLanguages } from '../../utils';
import { trashFingerprint, AvaFlag } from '../../../Fingerprints';
import { updateFingerprint } from '../../actions/updateFingerprint';
import type { T_Fingerprint } from '../../../../types';

interface I_Detail {
    fingerprint: T_Fingerprint;
}

type T_HistoryEntry = NonNullable<T_Fingerprint['history']>[number];

const InfoItem: React.FC<{ label: string; value: string | React.ReactNode; icon?: React.ReactNode }> = ({ label, value, icon }) => (
    <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            {icon && <Box sx={{ mr: 1, color: 'text.secondary' }}>{icon}</Box>}
            <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                {label}
            </Typography>
        </Box>
        <Box sx={{ color: 'text.primary' }}>{value}</Box>
    </Box>
);

const HistoryDetail: React.FC<{ entry: T_HistoryEntry; onClose: () => void; onRemove: () => void }> = ({ entry, onClose, onRemove }) => (
    <Card sx={{ mb: 2 }} variant="outlined">
        <CardHeader
            avatar={
                <Avatar
                    src={entry.favicon}
                    alt={entry.siteName}
                    variant="rounded"
                    sx={{ width: 28, height: 28 }}
                >
                    {entry.siteName?.charAt(0) || 'W'}
                </Avatar>
            }
            title={entry.title || entry.url}
            subheader={`${entry.siteName} • ${entry.tenant} • ${moment(entry.timestamp).fromNow()}`}
            action={
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton color="primary" onClick={onRemove} aria-label="remove history entry">
                        <Icon icon="delete" />
                    </IconButton>
                    <IconButton onClick={onClose} aria-label="close history detail">
                        <Icon icon="close" />
                    </IconButton>
                </Box>
            }
        />
    </Card>
);

export const Detail: React.FC<I_Detail> = ({
    fingerprint,
}) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleBack = () => {
        dispatch(navigateTo(router, '/fingerprints'));
    };

    const geo = fingerprint?.geo || {};
    const device = fingerprint?.device || {};
    const history: NonNullable<T_Fingerprint['history']> = fingerprint?.history || [];
    const [historyItems, setHistoryItems] = React.useState<T_HistoryEntry[]>(history);
    const [selectedHistoryIndex, setSelectedHistoryIndex] = React.useState<number | null>(null);
    const [confirmDelete, setConfirmDelete] = React.useState<{ type: 'fingerprint' | 'history'; index?: number } | null>(null);
    const selectedHistory = selectedHistoryIndex !== null ? historyItems[selectedHistoryIndex] : null;
    const currentPage = historyItems.length > 0
        ? historyItems.reduce((latest: T_HistoryEntry, entry: T_HistoryEntry) => (
            entry.timestamp > latest.timestamp ? entry : latest
        ), historyItems[0])
        : null;
    const countryCode = geo.country_code2 || null;
    const [editingName, setEditingName] = useState(false);
    const [nameValue, setNameValue] = useState(fingerprint.name || '');
    const inputRef = useRef<HTMLInputElement>(null);
    const displayName = nameValue || formatDeviceSummary(fingerprint.device) || 'Unknown device';

    React.useEffect(() => {
        setHistoryItems(history);
        if (selectedHistoryIndex !== null && selectedHistoryIndex >= history.length) {
            setSelectedHistoryIndex(null);
        }
    }, [history, selectedHistoryIndex]);

    const handleRemoveHistoryEntry = async (index: number | null) => {
        if (index === null) return;

        const updatedHistory = historyItems.filter((_, i) => i !== index);
        setHistoryItems(updatedHistory);
        setSelectedHistoryIndex(null);

        await dispatch(updateFingerprint(fingerprint.id, 'history', updatedHistory));
    };


    const handleConfirmDelete = async () => {
        if (!confirmDelete) return;

        if (confirmDelete.type === 'fingerprint') {
            const result = await dispatch(trashFingerprint(fingerprint.id));
            setConfirmDelete(null);
            // Go back to all fingerprints after trashing
            dispatch(navigateTo(router, '/fingerprints'));
            return;
        }

        if (confirmDelete.type === 'history') {
            await handleRemoveHistoryEntry(confirmDelete.index ?? null);
        }

        setConfirmDelete(null);
    };

    const handleCancelDelete = () => {
        setConfirmDelete(null);
    };

    const handleNameEdit = () => {
        setEditingName(true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 50);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameValue(e.target.value);
    };

    const handleNameBlur = async () => {
        setEditingName(false);
        if (nameValue !== fingerprint.name) {
            await dispatch(updateFingerprint(fingerprint.id, 'name', nameValue));
        }
    };

    const handleNameKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            inputRef.current?.blur();
        } else if (e.key === 'Escape') {
            setNameValue(fingerprint.name || '');
            setEditingName(false);
        }
    };

    return (
        <Box sx={{  }}>
            <Box sx={{ mb: 3 }}>
                <Button
                    startIcon={<Icon icon="left" />}
                    endIcon={<Icon icon="fingerprint" />}
                    onClick={handleBack}
                    variant="contained"
                    size="small"
                >
                    All
                </Button>
            </Box>

            <Card sx={{ mb: 3 }} variant="outlined">
                <CardHeader
                    avatar={countryCode ? (
                        <AvaFlag
                            countryCode={countryCode}
                            avatarUrl={`https://goldlabel.pro/shared/svg/characters/${fingerprint.avatar}.svg`}
                            size={90}
                            position="bottom-left"
                        />
                    ) : undefined}
                    title={
                        editingName ? (
                            <TextField
                                inputRef={inputRef}
                                value={nameValue}
                                onChange={handleNameChange}
                                onBlur={handleNameBlur}
                                onKeyDown={handleNameKeyDown}
                                variant="filled"
                                fullWidth
                                size="small"
                                InputProps={{
                                    disableUnderline: false,
                                    style: {
                                        fontSize: 28,
                                        fontWeight: 700,
                                        padding: 0,
                                        margin: 0,
                                        background: 'transparent',
                                    },
                                }}
                                inputProps={{
                                    maxLength: 64,
                                    style: {
                                        padding: 0,
                                    },
                                }}
                                sx={{
                                    '& .MuiFilledInput-root': {
                                        background: 'transparent',
                                        fontSize: 28,
                                        fontWeight: 700,
                                        padding: 0,
                                    },
                                }}
                            />
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h4" component="h1" sx={{ cursor: 'pointer' }} onClick={handleNameEdit}>
                                    {displayName}
                                </Typography>
                                <IconButton size="small" onClick={handleNameEdit} aria-label="Edit name">
                                    <Icon icon="edit" />
                                </IconButton>
                            </Box>
                        )
                    }
                    action={
                        <IconButton
                            color="primary"
                            onClick={() => setConfirmDelete({ type: 'fingerprint' })}
                            aria-label="delete fingerprint"
                        >
                            <Icon icon="delete" />
                        </IconButton>
                    }
                />
                <CardContent sx={{ pt: 0 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, md: 7 }}>
                            
                            {currentPage && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            maxWidth: 420,
                                            display: 'block',
                                        }}
                                    >
                                        {currentPage.title || currentPage.siteName || currentPage.url}
                                        {currentPage.timestamp && (
                                            <Box component="span" sx={{ ml: 0.5, opacity: 0.7 }}>
                                                · {moment(currentPage.timestamp).fromNow()}
                                            </Box>
                                        )}
                                    </Typography>
                                </Box>
                            )}
                        </Grid>
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                    IP: {geo.ip || 'Unknown'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {device.browser || 'Unknown browser'} · {device.os || 'Unknown OS'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {device.platform || 'Unknown platform'}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Dialog
                open={Boolean(confirmDelete)}
                onClose={handleCancelDelete}
                aria-labelledby="confirm-delete-dialog-title"
            >
                <DialogTitle id="confirm-delete-dialog-title">Trash?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {confirmDelete?.type === 'fingerprint'
                            ? 'Sure you want to trash this fingerprint?'
                            : 'Remove this history entry from the fingerprint?'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>
                        No
                    </Button>
                    <Button 
                        onClick={handleConfirmDelete} 

                        color="primary" 
                        variant="contained"
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            <Grid container spacing={3}>
                {selectedHistory && (
                    <Grid size={{ xs: 12 }}>
                        <HistoryDetail
                            entry={selectedHistory}
                            onClose={() => setSelectedHistoryIndex(null)}
                            onRemove={() => setConfirmDelete({ type: 'history', index: selectedHistoryIndex ?? undefined })}
                        />
                    </Grid>
                )}

                <Grid size={{ xs: 12 }}>
                    <Accordion variant="outlined" sx={{ width: '100%' }}>
                        <AccordionSummary
                            expandIcon={<Icon icon="expand" />}
                            aria-controls="history-content"
                            id="history-header"
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Icon icon="aicase" />
                                <Typography variant="h6">History</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                    {historyItems.length} visits
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0 }}>
                            {historyItems.length > 0 ? (
                                <List>
                                    {historyItems.map((item: any, index: number) => (
                                        <React.Fragment key={index}>
                                            <ListItemButton alignItems="flex-start" onClick={() => setSelectedHistoryIndex(index)}>
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        flexWrap: 'wrap',
                                                        mb: 1,
                                                    }}>
                                                        <Avatar
                                                            src={item.favicon}
                                                            alt={item.siteName}
                                                        >
                                                            {item.siteName?.charAt(0) || 'W'}
                                                        </Avatar>
                                                        <Typography variant="body1">
                                                            {item.title || item.url}
                                                        </Typography>
                                                        <Chip
                                                            label={moment(item.timestamp).fromNow()}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ fontSize: '0.7rem' }}
                                                        />
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {item.url}
                                                    </Typography>
                                                </Box>
                                            </ListItemButton>
                                            {index < historyItems.length - 1 && <Divider component="li" />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            ) : (
                                <Box sx={{ p: 3, textAlign: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No browsing history available
                                    </Typography>
                                </Box>
                            )}
                        </AccordionDetails>
                    </Accordion>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Accordion variant="outlined">
                        <AccordionSummary
                            expandIcon={<Icon icon="expand" />}
                            aria-controls="basic-info-content"
                            id="basic-info-header"
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Icon icon="info" />
                                <Typography variant="h6">Basic</Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <InfoItem
                                label="Fingerprint ID"
                                value={
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                        {fingerprint.id}
                                    </Typography>
                                }
                            />
                            <InfoItem
                                label="Created"
                                value={moment(fingerprint.created || 0).fromNow()}
                            />
                            <InfoItem
                                label="Last Updated"
                                value={moment(fingerprint.updated || 0).fromNow()}
                            />
                        </AccordionDetails>
                    </Accordion>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Accordion variant="outlined">
                        <AccordionSummary
                            expandIcon={<Icon icon="expand" />}
                            aria-controls="device-info-content"
                            id="device-info-header"
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Icon icon="mobile" />
                                <Typography variant="h6">Device</Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <InfoItem
                                label="Browser"
                                value={`${device.browser || 'Unknown'} ${device.browserVersion || ''}`}
                            />
                            <InfoItem
                                label="Operating System"
                                value={`${device.os || 'Unknown'} ${device.osVersion || ''}`}
                            />
                            <InfoItem
                                label="Platform"
                                value={device.platform || 'Unknown'}
                            />
                            <InfoItem
                                label="Device Model"
                                value={device.model || device.modelCode || 'Unknown'}
                            />
                            <InfoItem
                                label="Vendor"
                                value={device.vendor || 'Unknown'}
                            />
                            <InfoItem
                                label="Type"
                                value={device.isMobile ? 'Mobile' : 'Desktop'}
                            />
                            {device.languages && device.languages.length > 0 && (
                                <InfoItem
                                    label="Languages"
                                    value={formatLanguages(device.languages)}
                                />
                            )}
                            <InfoItem
                                label="User Agent"
                                value={
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all' }}>
                                        {device.ua || 'Unknown'}
                                    </Typography>
                                }
                            />
                        </AccordionDetails>
                    </Accordion>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Accordion variant="outlined">
                        <AccordionSummary
                            expandIcon={<Icon icon="expand" />}
                            aria-controls="location-info-content"
                            id="location-info-header"
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Icon icon="geo" />
                                <Typography variant="h6">Location</Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <InfoItem
                                        label="IP Address"
                                        value={geo.ip || 'Unknown'}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <InfoItem
                                        label="City"
                                        value={geo.city || 'Unknown'}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <InfoItem
                                        label="Country"
                                        value={geo.country_name || 'Unknown'}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <InfoItem
                                        label="ISP"
                                        value={geo.isp || 'Unknown'}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <InfoItem
                                        label="State/Province"
                                        value={geo.state_prov || 'Unknown'}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <InfoItem
                                        label="District"
                                        value={geo.district || 'Unknown'}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <InfoItem
                                        label="ZIP Code"
                                        value={geo.zipcode || 'Unknown'}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <InfoItem
                                        label="Connection Type"
                                        value={geo.connection_type || 'Unknown'}
                                    />
                                </Grid>
                                {geo.latitude && geo.longitude && (
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <InfoItem
                                            label="Coordinates"
                                            value={`${geo.latitude}, ${geo.longitude}`}
                                        />
                                    </Grid>
                                )}
                                {geo.time_zone && (
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <InfoItem
                                            label="Time Zone"
                                            value={geo.time_zone.name || 'Unknown'}
                                        />
                                    </Grid>
                                )}
                                {geo.currency && (
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <InfoItem
                                            label="Currency"
                                            value={`${geo.currency.code} (${geo.currency.symbol})`}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>
        </Box>
    );
};