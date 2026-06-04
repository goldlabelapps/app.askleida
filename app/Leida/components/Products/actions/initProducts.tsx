import { setProducts } from '../../Products';
import { setFeedback } from '../../../../NX/DesignSystem';

export const initProducts = (practitionerId?: string): any =>
    async (dispatch: any) => {
        try {
            dispatch(setProducts('loading', true));
            dispatch(setProducts('error', null));

            const query = practitionerId
                ? `?practitioner_id=${encodeURIComponent(practitionerId)}`
                : '';
            const response = await fetch(`/api/products${query}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch products (${response.status})`);
            }

            const payload = await response.json();
            const list = Array.isArray(payload?.data) ? payload.data : [];

            dispatch(setProducts('list', list));
            dispatch(setProducts('initted', true));
            dispatch(setProducts('loading', false));
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setFeedback({
                title: 'Products Load Failed',
                description: msg,
                severity: 'error',
            }));
            dispatch(setProducts('list', []));
            dispatch(setProducts('error', msg));
            dispatch(setProducts('initted', true));
            dispatch(setProducts('loading', false));
        }
    };