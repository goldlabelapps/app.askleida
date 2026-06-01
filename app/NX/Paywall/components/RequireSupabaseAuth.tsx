"use client";

import React, { useState } from 'react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import SupabaseLogin from './SupabaseLogin';
import { Backdrop, CircularProgress, Box, Typography } from '@mui/material';
import { supabase } from '../../lib/supabase';
import { NX } from '../../../NX';
import { Signin } from '../../../Leida'; // Adjust the path as needed

import { getTenant } from '../../../NX/lib/getTenant';

export default function RequireSupabaseAuth({ children, publicUrl }: { children: React.ReactNode; publicUrl: string }) {
  const { user, loading } = useSupabaseAuth();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // Get config for NX wrapper
  const { config } = getTenant();

  const handleSupabaseLogin = async (email: string, password: string) => {
    setPending(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setPending(false);
  };

  return (
    <NX config={config}>
      {loading || pending ? (
        <Backdrop open 
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="body2" sx={{ mb: 2 }}>
              Supabasing ...
            </Typography>
            <CircularProgress color="inherit" />
          </Box>
        </Backdrop>
      ) : !user ? (
        <Signin publicUrl={publicUrl} onSignin={handleSupabaseLogin} error={error} />
      ) : (
        <>{children}</>
      )}
    </NX>
  );
}
