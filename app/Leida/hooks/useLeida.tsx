"use client";

import { useAccount } from '../components/Account/hooks/useAccount';
import { useClients } from '../components/Clients/hooks/useClients';
import { useTips } from '../components/Tips/hooks/useTips';
import { useLivingRoutine } from '../components/LivingRoutine/hooks/useLivingRoutine';

export function useLeida() {
  const account = useAccount();
  const clients = useClients();
  const tips = useTips();
  const livingRoutine = useLivingRoutine();

  return {
    account,
    clients,
    tips,
    livingRoutine,
  };
}
