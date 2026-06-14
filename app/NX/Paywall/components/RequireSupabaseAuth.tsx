"use client";

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import SupabaseLogin from './SupabaseLogin';
import { Backdrop, Box, Typography } from '@mui/material';
import { supabase } from '../../lib/supabase';
import { NX } from '../../../NX';
import { Signin } from '../../../Leida'; // Adjust the path as needed
import OverlaySpinner from '../../DesignSystem/components/OverlaySpinner';

import { getTenant } from '../../../NX/lib/getTenant';

export default function RequireSupabaseAuth({ children, publicUrl }: { children: React.ReactNode; publicUrl: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useSupabaseAuth();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isInvitePending = Boolean(user?.invited_at && !user.confirmed_at);
  const shouldRedirectToInvite = isInvitePending && pathname !== '/account/invite';

  // Get config for NX wrapper
  const { config } = getTenant();

  React.useEffect(() => {
    if (shouldRedirectToInvite) {
      router.replace('/account/invite');
    }
  }, [router, shouldRedirectToInvite]);

  const handleSupabaseLogin = async (email: string, password: string) => {
    setPending(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setPending(false);
  };

  if (
    pathname?.startsWith('/account/invite') ||
    pathname?.startsWith('/account/forgot-password') ||
    pathname?.startsWith('/account/reset-password')
  ) {
    return <>{children}</>;
  }

  return (
    <NX config={config}>
      {loading || pending || shouldRedirectToInvite ? (
        <Backdrop open 
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            color: '#eef3ff',
            backgroundColor: 'rgba(8, 13, 24, 0.34)',
            backdropFilter: 'blur(2px)',
          }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="body2" sx={{ mb: 2 }}>
              Supabasing ...
            </Typography>
            <OverlaySpinner />
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
