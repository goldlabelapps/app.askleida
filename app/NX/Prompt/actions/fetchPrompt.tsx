import type { T_UbereduxDispatch } from '../../types';
import { setUbereduxKey } from '../../Uberedux';
import { setKey } from '../../Prompt';
import { setFeedback } from '../../DesignSystem';

export const fetchPrompt = (linkedin_url: string, prompt: string) =>
    async (dispatch: T_UbereduxDispatch) => {
        try {
            dispatch(setKey("fetching", true));
            const endpoint = `${process.env.NEXT_PUBLIC_PYTHON_URL}prompt/linkedin`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    linkedin_url,
                    prompt,
                }),
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
                const endpoint = `${process.env.NEXT_PUBLIC_PYTHON_URL}prompts`;
                msg = `Can't fetch endpoint ${endpoint}`;
            }
            dispatch(setKey('error', msg));
            dispatch(setUbereduxKey({ key: 'error', value: msg }));
            dispatch(setKey("fetching", false));
        }
    };
