'use client';
import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import {
    Alert,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    Divider,
    FormControl,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useDispatch } from '../../../NX/Uberedux';
import { useSupabaseAuth } from '../../../NX/Paywall';
import { initClients, useClients } from '../Clients';

const getClientFullName = (client: any) => {
    const firstName = client?.data?.first_name || client?.first_name || '';
    const lastName = client?.data?.last_name || client?.last_name || '';
    return `${firstName} ${lastName}`.trim() || client?.title || 'Unnamed client';
};

const makeDraft = ({
    clientName,
    concernTags,
    therapistContext,
    tips,
}: {
    clientName: string;
    concernTags: string[];
    therapistContext: string;
    tips: string;
}) => {
    const concernLine = concernTags.length ? concernTags.join(', ') : 'general skin resilience';
    return [
        `Hi ${clientName},`,
        '',
        'It was lovely to see you in clinic today. Based on your consultation and skin goals, this plan is written specifically for you.',
        '',
        `Primary focus: ${concernLine}.`,
        '',
        'AM routine:',
        '1. Gentle cleanse with lukewarm water.',
        '2. Hydrating serum while skin is still slightly damp.',
        '3. Barrier-support moisturiser.',
        '4. Broad-spectrum SPF 50 every morning.',
        '',
        'PM routine:',
        '1. Thorough cleanse to remove SPF and makeup.',
        '2. Active treatment as advised in clinic (build frequency slowly).',
        '3. Recovery moisturiser to lock in hydration.',
        '',
        therapistContext ? `Clinical context: ${therapistContext}` : '',
        tips ? `Extra therapist notes: ${tips}` : '',
        '',
        'If your skin flares, pause actives for 48 hours and focus on hydration and barrier support. Message me if symptoms persist.',
        '',
        'You are doing brilliantly. Consistency over perfection is what gets results.',
    ]
        .filter(Boolean)
        .join('\n');
};

export default function Recommendations() {
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const { user } = useSupabaseAuth();
    const clients = useClients();
    const list = Array.isArray(clients?.list) ? clients.list : [];
    const initialClientId = searchParams.get('clientId') || '';

    const [selectedClientId, setSelectedClientId] = React.useState(initialClientId);
    const [therapistContext, setTherapistContext] = React.useState('');
    const [tips, setTips] = React.useState('');
    const [generatedDraft, setGeneratedDraft] = React.useState('');
    const [generating, setGenerating] = React.useState(false);

    React.useEffect(() => {
        if (!clients?.initted && !clients?.loading && user?.id) {
            dispatch(initClients(user.id));
        }
    }, [dispatch, clients?.initted, clients?.loading, user?.id]);

    const selectedClient = React.useMemo(() => {
        if (!selectedClientId) {
            return null;
        }
        return list.find((client: any) => client?.client_id === selectedClientId) || null;
    }, [list, selectedClientId]);

    const selectedClientName = selectedClient ? getClientFullName(selectedClient) : 'Client';
    const concernTags = Array.isArray(selectedClient?.data?.concern_tags)
        ? selectedClient.data.concern_tags.filter((tag: unknown) => typeof tag === 'string')
        : [];

    const handleGenerate = () => {
        if (!selectedClient) {
            window.alert('Choose a client first.');
            return;
        }

        setGenerating(true);
        window.setTimeout(() => {
            setGeneratedDraft(
                makeDraft({
                    clientName: selectedClientName,
                    concernTags,
                    therapistContext,
                    tips,
                }),
            );
            setGenerating(false);
        }, 650);
    };

    const handleExportPdf = () => {
        if (!generatedDraft.trim()) {
            window.alert('Generate content before exporting PDF.');
            return;
        }

        window.alert(`PDF export placeholder for ${selectedClientName}`);
    };

    return (
        <Stack spacing={2}>
            <Alert severity="info">
                Generate content to preview your personalised recommendation before exporting.
            </Alert>
            <Card variant="outlined">
                <CardHeader
                    title={<Typography variant="h6">Recommendations</Typography>}
                    subheader={<Typography variant="body1">
                            Create personalised client PDFs in under two minutes
                        </Typography>}
                    
                />
                <CardContent>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            This is the Leida's core feature. Choose a client, add your clinical context, generate AI personalised homecare copy, then export to PDF to send to your client.
                        </Typography>
                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                            <Chip label="Solo skin therapists" />
                            <Chip label="Personalised from scratch" />
                            <Chip label="Under 2 minutes" />
                        </Stack>
                </CardContent>
            </Card>

           

           
        </Stack>
    );
}
