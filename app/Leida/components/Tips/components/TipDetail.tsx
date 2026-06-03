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
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import { Icon, navigateTo, ConfirmAction } from '../../../../NX/DesignSystem';
import { useDispatch } from '../../../../NX/Uberedux';
import { deleteTip } from '../../Tips';

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

const TipDetail: React.FC<T_TipDetailProps> = ({
    tip,
}) => {

    const router = useRouter();
    const dispatch = useDispatch();
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const tipData = getDataObject(tip?.data);
    const title = getStringValue(tip?.title) || 'Untitled tip';
    const tipId = getStringValue(tip?.tip_id) || getStringValue(tip?.id || '');
    const category = getStringValue(tipData.category) || 'Not provided';
    const bullets = getArrayValues(tipData.bullets);

    if (!tip) {
        if (isDeleting) {
            return null;
        }
        return <Alert severity="warning">Tip details are not available.</Alert>;
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

    const handleNew = () => {
        dispatch(navigateTo(router, '/tips/new'));
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
                            <Typography variant="h6">
                                {title}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                {category}
                            </Typography>
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
                </CardContent>
                <CardActions>
                    <Button 
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
