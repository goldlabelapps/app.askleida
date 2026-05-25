'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  Stack,
} from '@mui/material';
import { 
  init,
  setKey, 
  useState,
} from '../../NX/Account';
import { useDispatch } from '../../NX/Uberedux';
import { useSupabaseAuth, SignOutBtn } from '../../NX/Paywall';
import { Icon } from '../../NX/DesignSystem';

export default function Account() {
  const router = useRouter();
  const { user } = useSupabaseAuth();
  const dispatch = useDispatch();
  const state = useState();
  const { initted } = state || {};

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
    <Box sx={{ mx: 2, my: 2 }}>
      <AccountCard account={state?.account} />
    </Box>
  );
}

function AccountCard({ account }: { account: any }) {
  if (!account) return null;
  const { name, email, avatar, level, created_at } = account;
  return (
    <Card variant="outlined">
      <CardHeader
        avatar={<Avatar src={avatar} alt={name} sx={{ width: 75, height: 75 }} />}
        title={<Typography variant="h6">{name}</Typography>}
        subheader={<>

          {[...Array(5)].map((_, i) => (
            <Icon key={i} icon={i < (typeof level === 'number' ? level : 0) ? 'staron' : 'staroff'} color={i < (typeof level === 'number' ? level : 0) ? 'prinary' : 'disabled'} />
          ))}
        </>}
        action={<SignOutBtn />}
      />
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          
          <Box>
            
            <Typography variant="body2" color="text.secondary">{email}</Typography>
            <Typography variant="caption" color="text.secondary">
              Joined: {created_at ? new Date(created_at).toLocaleDateString() : ''}
            </Typography>
          </Box>
        </Stack>
        
        
      </CardContent>
    </Card>
  );
}
