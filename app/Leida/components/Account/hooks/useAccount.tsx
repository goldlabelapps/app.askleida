"use client";
import type { T_RootState } from '../../../../NX/Uberedux/store';
import { useSelector } from 'react-redux';

export function useAccount() {
  const slice = useSelector((state: T_RootState) => state.redux.practitioner);
  return slice;
}
