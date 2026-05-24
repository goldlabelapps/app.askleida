'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Button, 
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material';
import { 
  init,
  setKey, 
  useState,
} from '../../NX/Dashboard';
import { useDispatch } from '../../NX/Uberedux';
import { navigateTo } from '../../NX/DesignSystem';

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
      <Box>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>  

        <List>
          
          <ListItemButton
            onClick={() => dispatch(navigateTo(router, '/products'))}
          >
              <ListItemText primary="Products" />
          </ListItemButton>

        <ListItem>
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
          </ListItem>
        </List>
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

