import { setClients } from '../../Clients';

export const initClients = (): any =>
    async (dispatch: any) => {
        try {
            dispatch(setClients('loading', true));
            dispatch(setClients('error', null));

            const response = await fetch('/api/clients', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch clients (${response.status})`);
            }

            const payload = await response.json();
            const list = Array.isArray(payload?.data) ? payload.data : [];

            dispatch(setClients('list', list));
            dispatch(setClients('initted', true));
            dispatch(setClients('loading', false));
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setClients('list', []));
            dispatch(setClients('error', msg));
            dispatch(setClients('initted', true));
            dispatch(setClients('loading', false));
        }
    };