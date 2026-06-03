import { setTips } from '../../Tips';

export const initTips = (practitionerId?: string): any =>
    async (dispatch: any) => {
        try {
            dispatch(setTips('loading', true));
            dispatch(setTips('error', null));

            const query = practitionerId
                ? `?practitioner_id=${encodeURIComponent(practitionerId)}`
                : '';
            const [response, categoriesResponse] = await Promise.all([
                fetch(`/api/tips${query}`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    },
                }),
                fetch('/api/tips/categories/f3dde5b6-b389-4493-a480-a414689a6023', {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    },
                }),
            ]);

            if (!response.ok) {
                throw new Error(`Failed to fetch tips (${response.status})`);
            }

            if (!categoriesResponse.ok) {
                throw new Error(`Failed to fetch tip categories (${categoriesResponse.status})`);
            }

            const [payload, categoriesPayload] = await Promise.all([
                response.json(),
                categoriesResponse.json(),
            ]);
            const list = Array.isArray(payload?.data) ? payload.data : [];
            const categories = Array.isArray(categoriesPayload?.data) ? categoriesPayload.data : [];

            dispatch(setTips('list', list));
            dispatch(setTips('categories', categories));
            dispatch(setTips('initted', true));
            dispatch(setTips('loading', false));
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setTips('list', []));
            dispatch(setTips('categories', []));
            dispatch(setTips('error', msg));
            dispatch(setTips('initted', true));
            dispatch(setTips('loading', false));
        }
    };