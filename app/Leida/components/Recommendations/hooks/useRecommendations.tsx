"use client";
import type { T_RootState } from '../../../../NX/Uberedux/store';
import { useSelector } from 'react-redux';

export function useRecommendations() {
  const slice = useSelector((state: T_RootState) => state.redux.recommendations);
  return slice;
}
