'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Grid,
} from '@mui/material';
import { 
  init,
  setKey, 
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

  const handleBtnClick = () => {
    dispatch(setKey('handleBtnClick', true));
  };

  if (!initted) return null;
  
  return (<>
      <Box sx={{mx:2}}>
        <Grid container spacing={2}>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <Account />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <List>

              <ListItemButton
                onClick={() => dispatch(navigateTo(router, '/products'))}
              >
                <ListItemIcon><Icon icon="products" color="primary" /></ListItemIcon>
                <ListItemText primary="Products" />
              </ListItemButton>

              {/* <ListItem>
                <ListItemText primary="Onboarding" />
              </ListItem>

              <ListItem>
                <ListItemText primary="Clients" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Recommendations" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Tips" />
              </ListItem> */}

            </List>
          </Grid>

        
          
        </Grid>
        
{/* 
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleBtnClick}
        >
        handleBtnClick
        </Button>

        <pre>{JSON.stringify(state, null, 2)} </pre>  */}
      </Box>
    </>
  );
}

