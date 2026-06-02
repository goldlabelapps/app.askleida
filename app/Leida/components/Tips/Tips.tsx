'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
    Box,
    Alert,
    Avatar,
    Button,
    CardHeader,
    LinearProgress,
    List,
    ListItem,
    ListItemAvatar,
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
    const avatarColorsRef = React.useRef<Record<string, string>>({});

    const getRandomPastelColor = React.useCallback(() => {
        const hue = Math.floor(Math.random() * 360);
        const saturation = 55 + Math.floor(Math.random() * 20); // 55-74%
        const lightness = 82 + Math.floor(Math.random() * 10); // 82-91%
        return `hsl(${hue} ${saturation}% ${lightness}%)`;
    }, []);

    const getAvatarColor = React.useCallback((key: string) => {
        if (!avatarColorsRef.current[key]) {
            avatarColorsRef.current[key] = getRandomPastelColor();
        }
        return avatarColorsRef.current[key];
    }, [getRandomPastelColor]);

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
                    <Icon icon="tips" color="primary" />
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
                        New tip
                    </Button>
                </>}
            />
            
                {tips?.loading ? (
                    <LinearProgress />
                ) : tips?.error ? (
                    <Alert severity="error">{String(tips.error)}</Alert>
                ) : (
                    <>
                        {list.length === 0 ? (
                            <Alert severity="info">No results found.</Alert>
                        ) : (
                            <List dense>
                                {list.map((tip: any) => {
                                    const firstName = tip?.data?.first_name || tip?.first_name || '';
                                    const lastName = tip?.data?.last_name || tip?.last_name || '';
                                    const fullName = tip?.title || '';
                                    const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?';
                                    const tipId = tip?.tip_id;
                                    const avatarKey = String(tipId || fullName);
                                    const avatarColor = getAvatarColor(avatarKey);

                                    return (
                                        <ListItem key={avatarKey} disablePadding>
                                            <ListItemButton
                                                disabled={!tipId}
                                                onClick={() => {
                                                    if (tipId) {
                                                        const qs = new URLSearchParams({ avatarColor }).toString();
                                                        dispatch(navigateTo(router, `/tips/${tipId}?${qs}`));
                                                    }
                                                }}
                                            >
                                                
                                                <ListItemText primary={<Typography variant="subtitle1">
                                                    {fullName}
                                                </Typography>} />
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
