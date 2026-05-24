import type { Dispatch } from 'redux';
import { setUbereduxKey } from '../../Uberedux';

export const createProduct = (
    key: string,
    value: any,
    successMsg?: string
): any =>
    async (dispatch: Dispatch, getState: () => any) => {
        try {
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setUbereduxKey({ key: 'error', value: msg }));
        }
    };