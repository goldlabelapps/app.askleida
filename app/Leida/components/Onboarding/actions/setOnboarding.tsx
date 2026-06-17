import type { T_RootState, T_UbereduxDispatch } from '../../../../NX/Uberedux/store';
import { setUbereduxKey } from '../../../../NX/Uberedux';

export const setOnboarding =
    (key: string, value: any): any =>
        async (dispatch: T_UbereduxDispatch, getState: () => T_RootState) => {
            try {
                const state = getState();
                const current = state?.redux?.onboarding || {};
                const updated = { ...current, [key]: value };
                dispatch(setUbereduxKey({ key: 'onboarding', value: updated }));
            } catch (e: unknown) {
                const msg = e instanceof Error ? e.message : String(e);
                dispatch(setUbereduxKey({ key: 'error', value: msg }));
            }
        };
