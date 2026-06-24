import { setClients } from '../../../../Leida';
import { setFeedback } from '../../../../NX/DesignSystem';

export const initClients = (practitionerId?: string): any =>
    async (dispatch: any) => {
        try {
            dispatch(setClients('loading', true));
            dispatch(setClients('error', null));

            const query = practitionerId
                ? `?practitioner_id=${encodeURIComponent(practitionerId)}`
                : '';
            const requestPath = `/api/clients${query}`;
            const requestUrl = typeof window === 'undefined'
                ? requestPath
                : new URL(requestPath, window.location.origin).toString();

            const response = await fetch(requestPath, {
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
            dispatch(setFeedback({
                title: 'Clients Load Failed',
                description: msg,
                severity: 'error',
            }));
            dispatch(setClients('list', []));
            dispatch(setClients('error', msg));
            dispatch(setClients('initted', true));
            dispatch(setClients('loading', false));
        }
    };