"use client";

import { useEffect, useRef, useState } from 'react';
import { getFirebaseFirestore } from '../../../../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useDispatch } from '../../../../Uberedux';
import { setFeedback } from '../../../../DesignSystem';

export function useSubscription(maxDocs = 10) {
  const dispatch = useDispatch();
  const [fingerprints, setFingerprints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const didInit = useRef(false);

  useEffect(() => {
    setLoading(true);
    const db = getFirebaseFirestore();
    const q = query(
      collection(db, 'fingerprints'),
      limit(Math.max(maxDocs * 5, 50))
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const sorted = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((doc: any) => !doc.trash)
        .sort((a: any, b: any) => (b.updated ?? b.created ?? 0) - (a.updated ?? a.created ?? 0))
        .slice(0, maxDocs);
      setFingerprints(sorted);
      setLoading(false);

      if (didInit.current) {
        dispatch(setFeedback({
          severity: 'info',
          title: 'Fingerprints updated',
        }));
      } else {
        didInit.current = true;
      }
    });
    return () => unsub();
  }, [dispatch, maxDocs]);

  return { fingerprints, loading };
}
