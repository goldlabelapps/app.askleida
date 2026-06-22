"use client";
import type { T_RootState } from '../../../../NX/Uberedux/store';
import { useSelector } from 'react-redux';

export function useLivingRoutine() {
  const slice = useSelector((state: T_RootState) => state.redux.livingRoutine);
  return slice;
}
