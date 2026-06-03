import type { T_RootState, T_UbereduxDispatch } from '../../../../NX/Uberedux/store';
import type { T_Tip } from '../types';
import { setUbereduxKey } from '../../../../NX/Uberedux';

export const patchTip = (
    tipId: string, 
    tip: T_Tip,
): any =>
        async (dispatch: T_UbereduxDispatch, getState: () => T_RootState) => {
            try {
                if (!tipId.trim()) {
                    throw new Error('Missing tip id');
                }
                console.log("T_TipData", tipId, tip);

            } catch (e: unknown) {
                const msg = e instanceof Error ? e.message : String(e);
                dispatch(setUbereduxKey({ key: 'error', value: msg }));
            }
        };
