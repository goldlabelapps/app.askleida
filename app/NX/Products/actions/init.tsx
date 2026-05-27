import type { T_UbereduxDispatch } from '../../types';
import { setUbereduxKey } from '../../Uberedux';
import { setKey, search } from '../../Products';

export const init = () =>
    async (dispatch: T_UbereduxDispatch) => {
        try {
            dispatch(setKey('loading', true));
            // Set default search params
            dispatch(setKey('searchParams', {
                s: '',
                page: 1,
                limit: 10,
            }));
            // Fetch products
            await dispatch(search());
            dispatch(setKey('initted', true));
            dispatch(setKey('loading', false));
        } catch (e) {
            let msg = e instanceof Error ? e.message : String(e);
            dispatch(setKey('error', msg));
            dispatch(setKey('loading', false));
            dispatch(setKey('initted', true));
            dispatch(setUbereduxKey({ key: 'error', value: msg }));
        }
    };
