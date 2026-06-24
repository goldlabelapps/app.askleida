import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Typography } from '@mui/material';
import { Icon, navigateTo } from '../../../../NX/DesignSystem';
import { useDispatch } from '../../../../NX/Uberedux';
import { Wrapper } from '../../../../Leida';

type ClientPreviewProps = {
    clientId?: string | null;
};

const ClientPreview: React.FC<ClientPreviewProps> = ({ clientId }) => {
    const router = useRouter();
    const dispatch = useDispatch();

    const handleBack = () => {
        const nextRoute = clientId ? `/clients/${encodeURIComponent(clientId)}` : '/clients';
        dispatch(navigateTo(router, nextRoute));
    };

    return (
        <Wrapper>
            <Button
                variant="outlined"
                size="large"
                startIcon={<Icon icon="left" />}
                color="primary"
                onClick={handleBack}
                sx={{ mb: 2 }}
            >
                Back
            </Button>
            <Typography variant="h6" sx={{ mb: 1 }}>
                Routine Preview
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Placeholder: routine preview experience will be added here.
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Client ID: {clientId || 'Not provided'}
            </Typography>
        </Wrapper>
    );
};

export default ClientPreview;
