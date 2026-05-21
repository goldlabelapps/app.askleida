"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useDispatch } from '../../Uberedux';
import { setPaywall } from '../../Paywall';
import type { User } from '@supabase/supabase-js';

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      dispatch(setPaywall('supabaseAuth', session?.user ?? null));
    });
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      dispatch(setPaywall('supabaseAuth', session?.user ?? null));
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
