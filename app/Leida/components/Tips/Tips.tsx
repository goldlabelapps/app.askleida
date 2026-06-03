'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
    Box,
    Alert,
    Button,
    CardHeader,
    CircularProgress,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material';
import { useDispatch } from '../../../NX/Uberedux';
import { Icon, navigateTo } from '../../../NX/DesignSystem';
import { useSupabaseAuth } from '../../../NX/Paywall';
import { initTips, useTips } from '../Tips';

export default function Tips() {

    const router = useRouter();
    const { user } = useSupabaseAuth();
    const dispatch = useDispatch();
    const tips = useTips();
    const list = Array.isArray(tips?.list) ? tips.list : [];

    React.useEffect(() => {
        if (!tips?.initted && !tips?.loading && user?.id) {
            dispatch(initTips(user.id));
        }
    }, [dispatch, tips?.initted, tips?.loading, user?.id]);

    const handleNew = () => {
        dispatch(navigateTo(router, '/tips/new'));
    };

    return (
        <Box>

            <CardHeader 
                avatar={<>
                    {tips?.loading ? <CircularProgress size={20} /> : <Icon icon="tips" color="primary" />}
                </>}
                title={<Typography variant="h6">
                    Tips
                </Typography>}
                action={<>
                    <Button
                        endIcon={<Icon icon="add" />}
                        color="primary"
                        onClick={handleNew}
                    >
                        New
                    </Button>
                </>}
            />
            
                {tips?.error ? (
                    <Alert severity="error">{String(tips.error)}</Alert>
                ) : (
                    <>
                        {list.length === 0 ? null : (
                            <List dense>
                                {list.map((tip: any) => {
                                    const title = typeof tip?.title === 'string' && tip.title.trim()
                                        ? tip.title.trim()
                                        : 'Untitled tip';
                                    const category = typeof tip?.data?.category === 'string'
                                        ? tip.data.category.trim()
                                        : '';
                                    const bullets = Array.isArray(tip?.data?.bullets)
                                        ? tip.data.bullets.filter((item: unknown) => typeof item === 'string' && item.trim())
                                        : [];
                                    const tipId = typeof tip?.tip_id === 'string' ? tip.tip_id : '';
                                    const itemKey = String(tipId || title);
                                    const summary = [
                                        category ? `${category}` : null,
                                        bullets.length ? `${bullets.length} bullet${bullets.length === 1 ? '' : 's'}` : null,
                                    ].filter(Boolean).join(' • ');

                                    return (
                                        <ListItem key={itemKey} disablePadding>
                                            <ListItemButton
                                                disabled={!tipId}
                                                onClick={() => {
                                                    if (tipId) {
                                                        dispatch(navigateTo(router, `/tips/${tipId}`));
                                                    }
                                                }}
                                            >
                                                
                                                <ListItemText
                                                    primary={<Typography variant="subtitle1">{title}</Typography>}
                                                    secondary={summary || undefined}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        )}
                    </>
                )}
        </Box>
    );
}
