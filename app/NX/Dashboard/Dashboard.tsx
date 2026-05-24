'use client';
import * as React from 'react';
import { 
  Box, 
  Typography,
} from '@mui/material';
import { 
  init, 
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

  if (!initted) return null
  
  return (<>
      <Box>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>        
      </Box>
    </>
  );
}

