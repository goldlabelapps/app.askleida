'use client';
import * as React from 'react';
import {
    Box,
    Typography,
    CardHeader,
} from '@mui/material';
import { Icon } from '../../../DesignSystem';
import { useHeader, NXAdminMenu } from '../../../NXAdmin';

export default function Header() {

    const header = useHeader();
    const title = header?.title || '';
    const icon = header?.icon || null;

    return (<>
            <CardHeader
                sx={{ width: '100%' }}
                avatar={icon ? <Icon icon={icon as any} /> : null}
                title={<Typography variant="h4" color="text.secondary">
                    {title}
                </Typography>}
                action={ <Box sx={{}}>
                          <NXAdminMenu />
                        </Box>}
            />
        </>
    );
}
