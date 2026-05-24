'use client';
import * as React from 'react';
import { 
  Box, 
  Button, 
  Typography,
} from '@mui/material';
import { 
  init,
  setKey, 
  useState,
} from '../../NX/Dashboard';
import { useDispatch } from '../../NX/Uberedux';

export default function Dashboard() {

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
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleBtnClick}
        >
        handleBtnClick
        </Button>

        <pre>{JSON.stringify(state, null, 2)} </pre> 
      </Box>
    </>
  );
}

