import type { T_UbereduxDispatch } from '../../types';
import { setUbereduxKey } from '../../Uberedux';
import { setKey } from '../../Products';

async function fetchJson(endpoint: string) {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(`Failed to fetch: ${endpoint}`);
    let data = null;
    try {
        data = await res.json();
    } catch {
        data = null;
    }
    return data;
}

export const init = () =>
    async (dispatch: T_UbereduxDispatch) => {
        try {
            dispatch(setKey('loading', true));
            const { defaultOrderSearchParams } = await import('./search');
            dispatch(setKey('searchParams', defaultOrderSearchParams));

            // Optionally, you could check /api/products for health, but we'll just try to fetch products
            const { search } = await import('./search');
            await dispatch(search());
            dispatch(setKey('initted', true));
            dispatch(setKey('loading', false));
        } catch (e) {
            let msg = e instanceof Error ? e.message : String(e);
            dispatch(setKey('error', msg));
            dispatch(setKey('loading', false));
            dispatch(setKey('initted', true));
            dispatch(setUbereduxKey({ key: 'error', value: msg }));
        }
    };
