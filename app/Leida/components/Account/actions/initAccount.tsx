import { setAccount } from '..';

const getAccountQuery = (lookupValue?: string) => {
    if (!lookupValue) {
        return '';
    }

    const trimmedValue = lookupValue.trim();
    if (!trimmedValue) {
        return '';
    }

    if (trimmedValue.includes('@')) {
        return `?email=${encodeURIComponent(trimmedValue.toLowerCase())}`;
    }

    return `?practitioner_id=${encodeURIComponent(trimmedValue)}`;
};

export const initAccount = (lookupValue?: string): any =>
    async (dispatch: any) => {
        try {
            dispatch(setAccount('loading', true));
            dispatch(setAccount('error', null));

            const query = getAccountQuery(lookupValue);
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