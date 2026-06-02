import { setPractitioner } from '../../Practitioner';

export const initPractitioner = (practitionerId?: string): any =>
    async (dispatch: any) => {
        try {
            dispatch(setPractitioner('loading', true));
            dispatch(setPractitioner('error', null));

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

            dispatch(setPractitioner('data', data));
            dispatch(setPractitioner('initted', true));
            dispatch(setPractitioner('loading', false));
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setPractitioner('data', null));
            dispatch(setPractitioner('error', msg));
            dispatch(setPractitioner('initted', true));
            dispatch(setPractitioner('loading', false));
        }
    };