"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
    Collapse,
    Paper,
    Typography,
    Alert,
    AppBar,
    Toolbar,
} from '@mui/material';
import { Icon, navigateTo } from '../../../../NX/DesignSystem';
import { useDispatch } from '../../../../NX/Uberedux';
import { useSupabaseAuth } from '../../../../NX/Paywall';
import { Editable } from '../../../../Leida';
import { createClient } from '../../../../Leida';

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

    return (
        <>
        
            <Paper variant="outlined" sx={{ p: 1.5, width: '100%' }}>
               
                    <Toolbar>
                    
                        <Typography
                            variant="h6"
                            sx={{ flexGrow: 1 }}
                        >
                            New Client
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<Icon icon="clients" />}
                            disabled={isSubmitting}
                            onClick={handleClients}
                        >
                            Clients
                        </Button>
                    
                    </Toolbar>


                <Typography
                    variant="body1"
                    sx={{ m: 2 }}>
                    Clients get an email to set up their account. 
                    They'll be asked to create a password and will
                    see a page which says Living Routine will appear 
                    here when your practitioner has published it"
                </Typography>

                {!valid && touched ? (
                    <Box sx={{ m: 2 }}>
                        <Alert severity="info" variant="outlined" sx={{ mt: 1 }}>
                            Please enter a valid email address
                        </Alert>
                    </Box>
                ) : null}


                <Box sx={{ m: 2 }}>
                    
                    <Editable
                        id="client_email"
                        label="Client email"
                        startAdornment='email'
                        variant="standard"
                        disabled={isSubmitting}
                        required
                        value={email}
                        onChange={(nextValue) => {
                            const v = typeof nextValue === 'string' ? nextValue : String(nextValue || '');
                            setEmail(v);
                            if (!touched) setTouched(true);
                        }}
                    />
                    
                </Box>

                <Collapse in={valid}>
                    <Box sx={{ my: 1 }}>
                        <Button
                            fullWidth
                            size="large"
                            color="primary"
                            variant="contained"
                            startIcon={<Icon icon="clients" />}
                            endIcon={<Icon icon="add" />}
                            disabled={isSubmitting}
                            onClick={handleNew}
                        >
                            {isSubmitting ? 'Adding Client...' : 'Add Client'}
                        </Button>
                    </Box>
                </Collapse>
            </Paper>
        </>
    );
};

export default ClientNew;
