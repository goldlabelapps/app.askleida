"use client";
import type { T_RootState } from '../../../../NX/Uberedux/store';
import { useSelector } from 'react-redux';

export function useTips() {
  const slice = useSelector((state: T_RootState) => state.redux.tips);
  return slice;
}
