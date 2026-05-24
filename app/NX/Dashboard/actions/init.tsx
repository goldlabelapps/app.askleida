import type { T_UbereduxDispatch } from '../../types';
import { setUbereduxKey } from '../../Uberedux';
import { setKey } from '../../Dashboard';

export const init = () =>
    async (dispatch: T_UbereduxDispatch) => {
        try {
            dispatch(setKey('initted', true));
        } catch (e) {
            let msg = e instanceof Error ? e.message : String(e);
            dispatch(setKey('error', msg));
            dispatch(setKey('initted', true));
            dispatch(setUbereduxKey({ key: 'error', value: msg }));
        }
    };
