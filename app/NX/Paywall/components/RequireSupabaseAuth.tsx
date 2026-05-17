"use client";

import React, { useState } from 'react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import SupabaseLogin from './SupabaseLogin';
import { Backdrop, CircularProgress, Box, Typography } from '@mui/material';
import { supabase } from '../../lib/supabase';


export default function RequireSupabaseAuth({ children, publicUrl }: { children: React.ReactNode; publicUrl: string }) {
  const { user, loading } = useSupabaseAuth();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSupabaseLogin = async (email: string, password: string) => {
    setPending(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setPending(false);
  };

  if (loading || pending) return (
    <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Checking Supabase credentials...
        </Typography>
      </Box>
    </Backdrop>
  );
  if (!user) return <SupabaseLogin publicUrl={publicUrl} onSupabaseLogin={handleSupabaseLogin} error={error} />;
  return <>{children}</>;
}
