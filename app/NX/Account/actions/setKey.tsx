import type { T_UbereduxDispatch, T_RootState } from '../../types';
import { setUbereduxKey } from '../../Uberedux';

export const setKey =
  (key: string, value: any): any =>
    async (dispatch: T_UbereduxDispatch, getState: () => T_RootState) => {
      try {
        const current = getState().redux.account;
        const updated = {
          ...current,
          [key]: value,
        };
        dispatch(setUbereduxKey({ key: 'account', value: updated }));
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        dispatch(setUbereduxKey({ key: 'error', value: msg }));
      }
    };
