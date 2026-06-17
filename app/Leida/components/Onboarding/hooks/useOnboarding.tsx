"use client";
import type { T_RootState } from '../../../../NX/Uberedux/store';
import { useSelector } from 'react-redux';

export function useOnboarding() {
    const slice = useSelector((state: T_RootState) => state.redux.onboarding);
    return slice;
}
