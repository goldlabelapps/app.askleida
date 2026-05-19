'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import {
    Avatar,
    Box,
    Card,
    CardActionArea,
    CardContent,
    Grid,
    Tooltip,
    Typography,
} from '@mui/material';
import { navigateTo } from '../../../../../DesignSystem';
import { useDispatch } from '../../../../../Uberedux';
import { Device, AvaFlag } from '../../../Fingerprints';
import { formatDeviceSummary } from '../../utils';

export type T_Panel = {
    fingerprint: any;
    mode?: 'listitem' | 'detail';
};

export default function Panel({
    fingerprint,
    mode = 'listitem',
}: T_Panel) {

    const dispatch = useDispatch();
    const router = useRouter();

    const countryCode = fingerprint?.geo?.country_code2 || null;
    
    const handleClick = () => {
        dispatch(navigateTo(router, `/fingerprints/${encodeURIComponent(fingerprint.id)}`));
    };

    if (mode !== 'listitem') {
        return (
            <Box sx={{ p: 2 }}>
                <pre>{JSON.stringify(fingerprint?.id, null, 2)}</pre>
            </Box>
        );
    }

    const geo = fingerprint?.geo || {};
    const city = geo.city || 'Unknown';
    const ip = geo.ip || 'Unknown';

    const history: any[] = fingerprint?.history || [];
    const currentPage = history.length > 0
        ? history.reduce((latest: any, entry: any) =>
            (entry.timestamp > latest.timestamp ? entry : latest), history[0])
        : null;

    return (
        <Card sx={{ mb: 1 }} variant="outlined">
            <CardActionArea onClick={handleClick}>
                <CardContent sx={{ p: 2 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: { xs: 'flex-start', md: 'center' },
                            gap: 2,
                        }}
                    >
                        {/* Avatar + Info */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                            {countryCode && (
                                <AvaFlag
                                    countryCode={countryCode}
                                    avatarUrl={`https://goldlabel.pro/shared/svg/characters/${fingerprint.avatar}.svg`}
                                    position="bottom-left"
                                />
                            )}
                            <Box sx={{ minWidth: 0 }}>
                                <Typography variant="h6" sx={{ mb: 0.5 }} noWrap>
                                    {fingerprint.name || formatDeviceSummary(fingerprint.device) || 'Unknown device'}
                                </Typography>
                                {/* {currentPage && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
                                        {currentPage.favicon && (
                                            <Avatar
                                                src={currentPage.favicon}
                                                alt={currentPage.siteName}
                                                sx={{ width: 32, height: 32, mr: 1 }}
                                            />
                                        )}
                                        <Tooltip title={currentPage.url || ''} placement="bottom-start">
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    maxWidth: 300,
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
                                        </Tooltip>
                                    </Box>
                                )} */}
                            </Box>
                        </Box>
                        {/* IP and Device */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 0.5 }}>
                            <Device device={fingerprint.device} size="small" />
                            {/* <Typography variant="caption" color="text.secondary">
                                IP: {ip}
                            </Typography> */}
                        </Box>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}