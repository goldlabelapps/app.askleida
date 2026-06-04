// TipDetail
"use client";
import React from 'react';
import type { T_Tip } from '../types';
import { useRouter } from 'next/navigation';
import {
    Fab,
    Box,
    Button,
    CardActions,
    CardContent,
    CardHeader,
    Collapse,
    CircularProgress,
    IconButton,
} from '@mui/material';
import { Icon, navigateTo, ConfirmAction } from '../../../../NX/DesignSystem';
import { useDispatch } from '../../../../NX/Uberedux';
import { deleteTip, patchTip } from '../../Tips';
import { BulletEditor, Editable } from '../../../../Leida';


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
    const editableTitle = typeof activeTip?.title === 'string' ? activeTip.title : '';
    const tipId = getStringValue(activeTip?.tip_id) || getStringValue(activeTip?.id || '');
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

    const handleBulletsChange = (nextBullets: string[]) => {
        setDraftTip((currentTip) => {
            if (!currentTip) {
                return currentTip;
            }

            const currentData = getDataObject(currentTip.data);

            return {
                ...currentTip,
                data: {
                    ...currentData,
                    bullets: nextBullets,
                },
            };
        });
    };

    return (
            <Box>
                <Collapse in={isDirty} unmountOnExit>
                    <Box
                        sx={{
                            position: 'fixed',
                            right: { xs: 16, sm: 24 },
                            bottom: { xs: 16, sm: 24 },
                            zIndex: (theme) => theme.zIndex.appBar + 1,
                        }}
                    >
                        <Fab
                            color="primary"
                            disabled={isPatching}
                            onClick={handlePatch}
                        >
                            <Icon icon="save" />
                        </Fab>
                    </Box>
                </Collapse>
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
                            <Editable 
                                label="Title"
                                value={editableTitle}
                                placeholder="Add title"
                                onChange={handleTitleChange}
                            />

                            <BulletEditor
                                value={Array.isArray(draftTip?.data?.bullets) ? draftTip.data.bullets.filter((item): item is string => typeof item === 'string') : []}
                                onChange={handleBulletsChange}
                                disabled={isPatching}
                            />
                        </Box>
                        
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
