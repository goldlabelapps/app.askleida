import { setTips } from '../../Tips';

export const initTips = (practitionerId?: string): any =>
    async (dispatch: any) => {
        try {
            dispatch(setTips('loading', true));
            dispatch(setTips('error', null));

            const query = practitionerId
                ? `?practitioner_id=${encodeURIComponent(practitionerId)}`
                : '';
            const response = await fetch(`/api/tips${query}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch tips (${response.status})`);
            }

            const payload = await response.json();
            const list = Array.isArray(payload?.data) ? payload.data : [];

            dispatch(setTips('list', list));
            dispatch(setTips('initted', true));
            dispatch(setTips('loading', false));
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setTips('list', []));
            dispatch(setTips('error', msg));
            dispatch(setTips('initted', true));
            dispatch(setTips('loading', false));
        }
    };