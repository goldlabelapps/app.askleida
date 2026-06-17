import { setAccount } from '..';

export const initAccount = (practitionerId?: string): any =>
    async (dispatch: any) => {
        try {
            dispatch(setAccount('loading', true));
            dispatch(setAccount('error', null));

            const query = practitionerId
                ? `?practitioner_id=${encodeURIComponent(practitionerId)}`
                : '';
            const response = await fetch(`/api/practitioner${query}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch practitioner (${response.status})`);
            }

            const payload = await response.json();
            const data = payload?.data ?? null;

            dispatch(setAccount('data', data));
            dispatch(setAccount('initted', true));
            dispatch(setAccount('loading', false));
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setAccount('data', null));
            dispatch(setAccount('error', msg));
            dispatch(setAccount('initted', true));
            dispatch(setAccount('loading', false));
        }
    };