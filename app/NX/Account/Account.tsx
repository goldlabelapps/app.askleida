'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box,
  Button,
} from '@mui/material';
import { 
  init,
  setKey, 
  useState,
} from '../../NX/Account';
import { useDispatch } from '../../NX/Uberedux';
import { useSupabaseAuth } from '../../NX/Paywall';

export default function Account() {
  const router = useRouter();
  const { user } = useSupabaseAuth();
  const dispatch = useDispatch();
  const state = useState();
  const { initted, user_id } = state || {};

  React.useEffect(() => {
    if (!initted && user?.id) {
      dispatch(init(user?.id));
    }
  }, [initted, user, dispatch]);

  if (!initted) {
    return (
      <Box sx={{ mx: 2 }}>
        <pre>Loading account...</pre>
      </Box>
    );
  }

  return (
    <Box sx={{ mx: 2 }}>
      <pre>account: {JSON.stringify(state?.account, null, 2)}</pre>
    </Box>
  );
}
