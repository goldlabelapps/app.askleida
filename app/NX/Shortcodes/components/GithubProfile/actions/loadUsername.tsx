import type { T_UbereduxDispatch } from '../../../../types';
import { setUbereduxKey } from '../../../../Uberedux';
import { setKey } from '../../GithubProfile';
import { setFeedback } from '../../../../DesignSystem';

export const loadUsername = (
    username: string,
) =>
    async (dispatch: T_UbereduxDispatch) => {
        try {
            dispatch(setKey("fetching", true));
            const endpoint = `${process.env.NEXT_PUBLIC_PYTHON_URL}github?username=${username}`;
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            dispatch(setKey("response", data.data));
            dispatch(setKey('error', null));
            dispatch(setKey("fetching", false));
        } catch (e) {
            let msg = e instanceof Error ? e.message : String(e);
            if (msg === 'Failed to fetch') {
                const endpoint = `${process.env.NEXT_PUBLIC_PYTHON_URL}github?username=${username}`;
                msg = `Can't fetch ${endpoint}`;
            }
            dispatch(setKey('error', msg));
            dispatch(setUbereduxKey({ key: 'error', value: msg }));
            dispatch(setKey("fetching", false));
        }
    };
