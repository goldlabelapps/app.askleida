import type { Dispatch } from 'redux';
import { setUbereduxKey } from '../../../../Uberedux';
import { setNXAdmin } from '../../../../NXAdmin';
import { setProspects } from '../';

export const initProspects = (): any =>
    async (dispatch: Dispatch, getState: () => any) => {
        try {
            const nxAdmin = getState()?.redux?.nxAdmin || {};
            if (!nxAdmin.prospects) await dispatch(setNXAdmin('prospects', {
                    initialized: true,
            }));
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setUbereduxKey({ key: 'error', value: msg }));
        }
    };
