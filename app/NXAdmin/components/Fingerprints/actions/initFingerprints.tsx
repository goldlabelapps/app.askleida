import type { Dispatch } from 'redux';
import { setUbereduxKey } from '../../../../Uberedux';
import { setNXAdmin } from '../../../../NXAdmin';
import { setFingerprints } from '../';

export const initFingerprints = (): any =>
    async (dispatch: Dispatch, getState: () => any) => {
        try {
            const nxAdmin = getState()?.redux?.nxAdmin || {};
            if (!nxAdmin.fingerprints) await dispatch(setNXAdmin('fingerprints', {
                    initialized: true,
            }));
            // await dispatch(fetchQueue());
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setUbereduxKey({ key: 'error', value: msg }));
        }
    };
