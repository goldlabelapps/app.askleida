"use client";
import React from 'react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import SupabasePlaceholder from './SupabasePlaceholder';
import { Backdrop, CircularProgress, Box, Typography } from '@mui/material';

export default function RequireSupabaseAuth({ children, publicUrl }: { children: React.ReactNode; publicUrl: string }) {
  const { user, loading } = useSupabaseAuth();

  if (loading) return (
    <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Checking Supabase credentials...
        </Typography>
      </Box>
    </Backdrop>
  );
  if (!user) return <SupabasePlaceholder publicUrl={publicUrl} />;
  return <>{children}</>;
}
