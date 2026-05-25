import type { Dispatch } from 'redux';
import { setUbereduxKey } from '../../Uberedux';
import { setFeedback } from '../../DesignSystem';
import { setKey } from '../../Account';

export interface I_Account {
    user_id: string;
    email: string;
    name?: string | null;
    created_at?: string | null;
    avatar?: string | null;
    level?: number | null;
    updated_at?: string | null;
}

export const readAccounts = (user_id?: string): any =>
    async (dispatch: Dispatch, getState: () => any) => {
        try {
            dispatch(setKey('loading', true));
            let url = '/api/accounts';
            if (user_id) {
                url += `?id=${encodeURIComponent(user_id)}`;
            }
            const res = await fetch(url);
            const data = await res.json();
            if (!res.ok || data?.severity === 'error') {
                dispatch(setFeedback({
                    title: data?.message || 'Failed to fetch account(s)',
                    severity: 'error',
                }));
                dispatch(setKey('loading', false));
                return;
            }
            if (user_id) {
                dispatch(setKey('account', data.data as I_Account));
            } else {
                dispatch(setKey('accounts', data.data as I_Account[]));
            }
            dispatch(setKey('loading', false));
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setFeedback({
                title: msg,
                severity: 'error',
            }));
            dispatch(setKey('loading', false));
            dispatch(setUbereduxKey({ key: 'error', value: msg }));
        }
    };