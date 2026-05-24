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

export default function Dashboard() {

  const router = useRouter();
  const { user, loading } = useSupabaseAuth();
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
    dispatch(setKey('account', {}));
  };

  if (!initted) return null;
  
  return (<>
      <Box sx={{mx:2}}>
        <pre>{JSON.stringify(user, null, 2)} </pre> 
      </Box>
    </>
  );
}

/*
<Button 
          variant="contained" 
          color="primary" 
          onClick={handleBtnClick}
        >
        handleBtnClick
        </Button>

        
*/