'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box,
  List,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Grid,
} from '@mui/material';
import { 
  init,
  useState,
} from '../../NX/Dashboard';
import { useDispatch } from '../../NX/Uberedux';
import { navigateTo, Icon } from '../../NX/DesignSystem';
import { Account } from '../../NX/Account';

export default function Dashboard() {

  const router = useRouter();
  const dispatch = useDispatch(); 
  const state = useState();
  const {
    initted,
  } = state || {};

  React.useEffect(() => {
    if (!initted) {
          dispatch(init());
      }
  }, [initted, dispatch]);

  if (!initted) return null;
  
  return (<>
      <Box sx={{mx:2}}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <List sx={{mt:1}}>
              <ListItemButton
                onClick={() => router.push('/products')}
              >
                <ListItemIcon><Icon icon="products" color="primary" /></ListItemIcon>
                <ListItemText primary="Products" />
              </ListItemButton>

            </List>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Account />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
