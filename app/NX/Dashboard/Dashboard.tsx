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
            Clients Widget
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            Client Widget
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            Recommendations Widget
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            Products Widget
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
