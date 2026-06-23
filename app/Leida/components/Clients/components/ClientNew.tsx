"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
    Collapse,
    Grid,
    Typography,
} from '@mui/material';
import { Icon, navigateTo } from '../../../../NX/DesignSystem';
import { useDispatch } from '../../../../NX/Uberedux';
import { useSupabaseAuth } from '../../../../NX/Paywall';
import { 
    createClient,
    Editable,
    Wrapper,
 } from '../../../../Leida';

type T_ClientNewProps = {
    config?: unknown;
};

const isValidEmail = (value: string): boolean => {
    const email = value.trim();
    if (!email) {
        return false;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const ClientNew: React.FC<T_ClientNewProps> = ({ config }) => {

    void config;

    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useSupabaseAuth();

    const [email, setEmail] = React.useState('');
    const [touched, setTouched] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const valid = isValidEmail(email);

    const handleNew = async () => {
        if (!valid || isSubmitting) return;
        if (!user?.id) {
            setTouched(true);
            return;
        }

        setIsSubmitting(true);

        try {
            const newClientId = await dispatch(createClient({
                email,
                practitioner_id: user.id,
            }));
            if (newClientId) {
                // navigate to client detail or clients list
                dispatch(navigateTo(router, '/clients'));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClients = async () => {
        if (isSubmitting) {
            return;
        }
        dispatch(navigateTo(router, '/clients'));
    };

    const handleClientNew = async () => {
        if (isSubmitting) {
            return;
        }
        dispatch(navigateTo(router, '/clients'));
    };

    return (
        <>
            <Box sx={{ mb: 1 }}>
                <Button
                    startIcon={<Icon icon="left" />}
                    onClick={handleClients}
                    
                >
                    Clients
                </Button>
            </Box>
            
            <Wrapper>
                <Box sx={{ m: 2 }}>

                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{
                            xs: 12,
                        }}>
                            <Editable
                                id="client_email"
                                startAdornment='email'
                                variant="outlined"
                                disabled={isSubmitting}
                                required
                                value={email}
                                onChange={(nextValue) => {
                                    const v = typeof nextValue === 'string' ? nextValue : String(nextValue || '');
                                    setEmail(v);
                                    if (!touched) setTouched(true);
                                }}
                            />
                        </Grid>
                        <Grid size={{
                            xs: 12,
                        }}>
                            <Collapse in={valid}>
                                <Box sx={{ my: 1 }}>
                                    <Button
                                        size="large"
                                        color="primary"
                                        variant="contained"
                                        endIcon={<Icon icon="send" />}
                                        disabled={isSubmitting}
                                        onClick={handleNew}
                                    >
                                        {isSubmitting ? 'Inviting Client...' : 'Invite Client'}
                                    </Button>
                                </Box>
                            </Collapse>
                            <Collapse in={!valid}>
                                <Typography
                                    variant="body1"
                                    sx={{ my: 2 }}>
                                    Clients get an email invitation to set up their account.
                                    They'll be asked to create a password and will
                                    see a page which says Living Routine will appear
                                    here when your practitioner has published it
                                </Typography>
                            </Collapse>
                        </Grid>
                    </Grid>

                    
                </Box>
                
            </Wrapper>
        </>
    );
};

export default ClientNew;
