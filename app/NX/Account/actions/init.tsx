import type { T_UbereduxDispatch } from '../../types';

import { setUbereduxKey } from '../../Uberedux';
import { setKey } from '../../Account';
import { readAccounts } from './readAccounts';

export const init = (user_id: string) =>
    async (dispatch: T_UbereduxDispatch) => {
        try {
            if (user_id) {
                await dispatch(readAccounts(user_id));
                dispatch(setKey('user_id', user_id));
            }
            dispatch(setKey('initted', true));
        } catch (e) {
            let msg = e instanceof Error ? e.message : String(e);
            dispatch(setKey('error', msg));
            dispatch(setKey('initted', true));
            dispatch(setUbereduxKey({ key: 'error', value: msg }));
        }
    };
