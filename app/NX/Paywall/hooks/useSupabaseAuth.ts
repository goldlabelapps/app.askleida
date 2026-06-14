"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useDispatch } from '../../Uberedux';
import { setPaywall } from '../../Paywall';
import type { Session, User } from '@supabase/supabase-js';

type AuthMethod = string | { method?: string };

type AccessTokenClaims = {
  amr?: AuthMethod[];
};

function decodeAccessTokenClaims(accessToken?: string): AccessTokenClaims | null {
  if (!accessToken) return null;

  const [, payload] = accessToken.split('.');
  if (!payload) return null;

  try {
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4), '=');
    return JSON.parse(window.atob(paddedPayload)) as AccessTokenClaims;
  } catch {
    return null;
  }
}

export function sessionHasPasswordAuth(session: Session | null) {
  const claims = decodeAccessTokenClaims(session?.access_token);
  const methods = claims?.amr ?? [];

  return methods.some((entry) => {
    if (typeof entry === 'string') return entry === 'password';
    return entry?.method === 'password';
  });
}

export function sessionRequiresInvitePasswordSetup(session: Session | null) {
  return Boolean(session?.user?.invited_at && !sessionHasPasswordAuth(session));
}

export function useSupabaseAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
      setUser(session?.user ?? null);
      setLoading(false);
      dispatch(setPaywall('supabaseAuth', session?.user ?? null));
    });
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ?? null);
      setUser(session?.user ?? null);
      setLoading(false);
      dispatch(setPaywall('supabaseAuth', session?.user ?? null));
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [dispatch]);

  return {
    session,
    user,
    loading,
    requiresInvitePasswordSetup: sessionRequiresInvitePasswordSetup(session),
  };
}
