'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
    Alert,
    Avatar,
    IconButton,
    Card,
    CardHeader,
    CardContent,
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
import { initClients, useClients } from '../Clients';

export default function Clients() {

    const router = useRouter();
    const { user } = useSupabaseAuth();
    const dispatch = useDispatch();
    const clients = useClients();
    const list = Array.isArray(clients?.list) ? clients.list : [];
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
        if (!clients?.initted && !clients?.loading && user?.id) {
            dispatch(initClients(user.id));
        }
    }, [dispatch, clients?.initted, clients?.loading, user?.id]);

    const handleNew = () => {
        dispatch(navigateTo(router, '/clients/new'));
    };

    return (
        <Card variant="outlined">
            <CardHeader 
                avatar={<>
                    <Icon icon="clients" color="primary" />
                </>}
                title={<Typography variant="body1">{clients?.loading ? 'Loading clients...' : `You have ${list.length} clients`}</Typography>}
                action={<>
                    <IconButton
                        color="primary"
                        onClick={handleNew}
                    >
                        <Icon icon="add" />
                    </IconButton>
                </>}
            />
            
                {clients?.loading ? (
                    <LinearProgress />
                ) : clients?.error ? (
                    <Alert severity="error">{String(clients.error)}</Alert>
                ) : (
                    <List dense>
                        {list.map((client: any) => {
                            const firstName = client?.data?.first_name || client?.first_name || '';
                            const lastName = client?.data?.last_name || client?.last_name || '';
                            const fullName = `${firstName} ${lastName}`.trim() || 'Unnamed client';
                            const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?';
                            const clientId = client?.client_id;
                            const avatarKey = String(clientId || fullName);
                            const avatarColor = getAvatarColor(avatarKey);

                            return (
                                <ListItem key={avatarKey} disablePadding>
                                    <ListItemButton
                                        disabled={!clientId}
                                        onClick={() => {
                                            if (clientId) {
                                                const qs = new URLSearchParams({ avatarColor }).toString();
                                                dispatch(navigateTo(router, `/clients/${clientId}?${qs}`));
                                            }
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                sx={{
                                                    bgcolor: avatarColor,
                                                    color: '#334155',
                                                }}
                                            >
                                                {initials}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={<Typography variant="subtitle1">
                                            {fullName}

                                        </Typography>} />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                )}
        </Card>
    );
}
