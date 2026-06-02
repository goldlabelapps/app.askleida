import { setUbereduxKey } from '../../../../NX/Uberedux';
import { setClients } from '../../Clients';

export const initClients = (): any =>
    async (dispatch: any) => {
        try {
            dispatch(setClients('initted', true));
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setUbereduxKey({ key: 'error', value: msg }));
        }
    };