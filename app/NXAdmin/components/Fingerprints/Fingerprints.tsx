'use client';
import * as React from 'react';
import {
  Box,
  Typography,
  List,
} from '@mui/material';
// import { Icon } from '../../../DesignSystem';
import { setNXAdmin, useNXAdmin } from '../../../NXAdmin';
import { useDispatch } from '../../../Uberedux';
import {
  initFingerprints,
  useSubscription,
  useFingerprint,
  useDoc,
} from '../Fingerprints';
import { Panel, Detail } from './components/Fingerprint';

export default function Fingerprints() {
  const dispatch = useDispatch();
  const nxAdmin = useNXAdmin();

  // const slice = nxAdmin?.fingerprints || {};
  const didInit = React.useRef(false);
  const { fingerprints, loading } = useSubscription(100);
  const fingerprintId = useFingerprint();
  const doc = useDoc();

  React.useEffect(() => {
    if (!didInit.current) {
      if (!nxAdmin || !nxAdmin.fingerprints) {
        dispatch(initFingerprints());
      }
      didInit.current = true;
    }
  }, [dispatch, nxAdmin]);

  React.useEffect(() => {
      dispatch(setNXAdmin('header', {
        title: 'Fingerprints°',
        icon: 'fingerprint',
      }));
  }, [dispatch]);
  
  if (fingerprintId && doc) {
    return <Detail fingerprint={doc as any} />;
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ p: 2 }}>
          {loading ? (
            <Typography variant="body2">Loading...</Typography>
          ) : fingerprints.length === 0 ? (
            <Typography variant="body2">No fingerprints found.</Typography>
          ) : (
            <List disablePadding>
              {fingerprints.map((v: any) => (
                <Panel
                  key={v.id}
                  fingerprint={v}
                />
              ))}
            </List>
          )}
        </Box>
      </Box>
    </>
  );
}

