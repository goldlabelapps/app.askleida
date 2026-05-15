import type { T_UbereduxDispatch } from '../../../../types';
import { setUbereduxKey } from '../../../../Uberedux';
import { setKey, loadUsername } from '../../GithubProfile';

export const init = (username: string): any =>
    async (dispatch: T_UbereduxDispatch, getState: () => any) => {
        try {
            dispatch(loadUsername(username))
            dispatch(setKey('username', username));
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setUbereduxKey({ key: 'error', value: msg }));
        }
    };