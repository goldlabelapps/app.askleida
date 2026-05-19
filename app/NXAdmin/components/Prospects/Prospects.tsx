'use client';
import * as React from 'react';
import {
  Box,
  Typography,
  List,
} from '@mui/material';
import { setNXAdmin, useNXAdmin } from '../../../NXAdmin';
import { useDispatch } from '../../../Uberedux';
import {
  initProspects,
  useSubscription,
  useProspect,
  useDoc,
} from '../Prospects';
import { Panel, Detail } from './components/Prospect';

export default function Prospects() {
  const dispatch = useDispatch();
  const nxAdmin = useNXAdmin();
  const didInit = React.useRef(false);
  const { prospects, loading } = useSubscription(100);
  const prospectId = useProspect();
  const doc = useDoc();

  React.useEffect(() => {
    if (!didInit.current) {
      if (!nxAdmin || !nxAdmin.prospects) {
        dispatch(initProspects());
      }
      didInit.current = true;
    }
  }, [dispatch, nxAdmin]);

  React.useEffect(() => {
      dispatch(setNXAdmin('header', {
        title: 'Prospects°',
        icon: 'prospects',
      }));
  }, [dispatch]);
  
  if (prospectId && doc) {
    return <Detail prospect={doc as any} />;
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ p: 2 }}>
          {loading ? (
            <Typography variant="body2">Loading...</Typography>
          ) : prospects.length === 0 ? (
            <Typography variant="body2">No prospects found.</Typography>
          ) : (
            <List disablePadding>
              {prospects.map((v: any) => (
                <Panel
                  key={v.id}
                  prospect={v}
                />
              ))}
            </List>
          )}
        </Box>
      </Box>
    </>
  );
}
