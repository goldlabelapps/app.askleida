// TipDetail
"use client";
import React from 'react';
import type { T_Tip } from '../types';
import { useRouter } from 'next/navigation';
import {
    Box,
    Alert,
    Button,
    CardActions,
    CardContent,
    CardHeader,
    Collapse,
    CircularProgress,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import { Icon, navigateTo, ConfirmAction } from '../../../../NX/DesignSystem';
import { useDispatch } from '../../../../NX/Uberedux';
import { deleteTip, patchTip } from '../../Tips';
import { EditableText } from '../../../../Leida';

type T_TipDetailProps = {
    tip?: T_Tip | null;
};

const getStringValue = (value: unknown): string | null => {
    if (typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim();
    return trimmed ? trimmed : null;
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

const getDataObject = (value: unknown): Record<string, unknown> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    return value as Record<string, unknown>;
};

const cloneTip = (value: T_Tip | null | undefined): T_Tip | null => {
    if (!value) {
        return null;
    }

    return JSON.parse(JSON.stringify(value)) as T_Tip;
};

const areTipsEqual = (left: T_Tip | null, right: T_Tip | null): boolean => {
    if (!left && !right) {
        return true;
    }

    if (!left || !right) {
        return false;
    }

    return JSON.stringify(left) === JSON.stringify(right);
};

const buildTipPatch = (
    originalTip: T_Tip | null,
    draftTip: T_Tip | null,
): Partial<T_Tip> => {
    if (!draftTip) {
        return {};
    }

    if (!originalTip) {
        return { ...draftTip };
    }

    const patch: Partial<T_Tip> = {};
    const originalData = getDataObject(originalTip.data);
    const draftData = getDataObject(draftTip.data);
    const dataPatch: Record<string, unknown> = {};

    Object.keys(draftTip).forEach((key) => {
        if (key === 'data') {
            return;
        }

        if (JSON.stringify(originalTip[key]) !== JSON.stringify(draftTip[key])) {
            patch[key] = draftTip[key];
        }
    });

    const dataKeys = new Set([...Object.keys(originalData), ...Object.keys(draftData)]);
    dataKeys.forEach((key) => {
        if (JSON.stringify(originalData[key]) !== JSON.stringify(draftData[key])) {
            dataPatch[key] = draftData[key];
        }
    });

    if (Object.keys(dataPatch).length > 0) {
        patch.data = dataPatch;
    }

    return patch;
};

const TipDetail: React.FC<T_TipDetailProps> = ({
    tip,
}) => {

    const router = useRouter();
    const dispatch = useDispatch();
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [isPatching, setIsPatching] = React.useState(false);
    const [originalTip, setOriginalTip] = React.useState<T_Tip | null>(cloneTip(tip));
    const [draftTip, setDraftTip] = React.useState<T_Tip | null>(cloneTip(tip));

    React.useEffect(() => {
        const nextTip = cloneTip(tip);
        setOriginalTip(nextTip);
        setDraftTip(nextTip);
    }, [tip]);

    const isDirty = !areTipsEqual(originalTip, draftTip);
    const activeTip = draftTip ?? tip ?? null;
    const tipData = getDataObject(activeTip?.data);
    const editableTitle = typeof activeTip?.title === 'string' ? activeTip.title : '';
    const title = getStringValue(activeTip?.title) || 'Untitled tip';
    const tipId = getStringValue(activeTip?.tip_id) || getStringValue(activeTip?.id || '');
    const category = getStringValue(tipData.category) || 'Not provided';
    const bullets = getArrayValues(tipData.bullets);

    if (!activeTip) {
        if (isDeleting) {
            return null;
        }
        return null;
    }

    const handleOpenDeleteConfirm = () => {
        setConfirmOpen(true);
    };

    const handleCloseDeleteConfirm = () => {
        setConfirmOpen(false);
    };

    const handleDelete = async () => {
        if (!tipId) {
            setConfirmOpen(false);
            return;
        }
        setIsDeleting(true);
        setConfirmOpen(false);
        await dispatch(deleteTip(tipId));
        handleTipsNavigate();
    };

    const handleTipsNavigate = () => {
        dispatch(navigateTo(router, '/tips'));
    }

    const handlePatch = async () => {
        if (!draftTip || !tipId || !isDirty || isPatching) {
            return;
        }

        const patch = buildTipPatch(originalTip, draftTip);

        if (Object.keys(patch).length === 0) {
            return;
        }

        setIsPatching(true);
        const success = await dispatch(patchTip(tipId, patch));
        setIsPatching(false);

        if (success) {
            handleTipsNavigate();
        }
    };

    const handleNew = () => {
        dispatch(navigateTo(router, '/tips/new'));
    };

    const handleTitleChange = (nextTitle: string) => {
        setDraftTip((currentTip) => {
            if (!currentTip) {
                return currentTip;
            }

            return {
                ...currentTip,
                title: nextTitle,
            };
        });
    };

    return (
            <Box>
                <CardHeader
                    avatar={<>
                        <IconButton
                            color="primary"
                            onClick={handleTipsNavigate}
                        >
                            <Icon icon="tips" />
                        </IconButton>
                    </>
                }
                    action={<>
                        <Button
                            endIcon={<Icon icon="add" />}
                            color="primary"
                            onClick={handleNew}
                        >
                            New
                        </Button>
                        <IconButton
                            color="primary"
                            onClick={handleOpenDeleteConfirm}
                        >
                            <Icon icon="delete" />
                        </IconButton>
                    </>}
                />
                
                <CardContent>
                        <Box>
                            <EditableText 
                                label="Title"
                                value={editableTitle}
                                placeholder="Add title"
                                onChange={handleTitleChange}
                            />

                            {/* <Typography variant="body1" sx={{ mb: 1 }}>
                                {category}
                            </Typography> */}

                            {bullets.length ? (
                                <List dense>
                                    {bullets.map((bullet, index) => (
                                        <ListItem key={`${index}-${bullet.slice(0, 16)}`}>
                                            <ListItemText primary={<Typography>{`${index + 1}. ${bullet}`}</Typography>} />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : null}
                        </Box>
                        <Collapse in={isDirty} unmountOnExit>
                            <Button 
                                fullWidth
                                startIcon={isPatching ? <CircularProgress size={16} color="inherit" /> : <Icon icon="save" />}
                                variant="contained" 
                                disabled={isPatching}
                                onClick={handlePatch} 
                                sx={{ mt: 2 }}>
                                Save
                            </Button>
                        </Collapse>
                </CardContent>
                <CardActions>
                    <Button 
                        fullWidth
                        startIcon={<Icon icon="left" />}
                        variant="text" onClick={handleTipsNavigate}>
                        Back
                    </Button>
                </CardActions>

                <ConfirmAction
                    open={confirmOpen}
                    icon="delete"
                    title="Delete Tip?"
                    body="Are you sure you want to delete this tip? This action cannot be undone."
                    handleConfirm={handleDelete}
                    handleClose={handleCloseDeleteConfirm}
                />
            </Box>
    );
};

export default TipDetail;
