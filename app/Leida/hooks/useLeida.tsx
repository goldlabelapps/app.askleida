"use client";

import { useSupabaseAuth } from '../../NX/Paywall';
import { useAccount } from '../components/Account/hooks/useAccount';
import { useClients } from '../components/Clients/hooks/useClients';
import { useTips } from '../components/Tips/hooks/useTips';
import { useLivingRoutine } from '../components/LivingRoutine/hooks/useLivingRoutine';
import { useAccessLevel } from './useAccessLevel';

export function useLeida() {
  const { user } = useSupabaseAuth();
  const account = useAccount();
  const clients = useClients();
  const tips = useTips();
  const livingRoutine = useLivingRoutine();
  const access = useAccessLevel({
    user,
    accountState: account,
    livingRoutineState: livingRoutine,
  });

  return {
    user,
    account,
    clients,
    tips,
    livingRoutine,
    access,
  };
}
