import type { Dispatch } from 'redux';
import { setUbereduxKey } from '../../Uberedux';
import { setFeedback } from '../../DesignSystem';
import { setKey, search } from '../../Products';

export const createProduct = (
    key: string,
    value: any,
    successMsg?: string
): any =>
    async (dispatch: Dispatch, getState: () => any) => {
        try {
            dispatch(setKey('loading', true));
            // POST to API
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(value),
            });
            const data = await res.json();
            if (!res.ok || data?.severity === 'error') {
                dispatch(setFeedback({
                    title: data?.message || 'Failed to create product',
                    severity: 'error',
                }));
                dispatch(setKey('loading', false));
                return;
            }
            dispatch(setFeedback({
                title: successMsg || 'Product created successfully',
                severity: 'success',
            }));
            // Optionally, clear form or do other UI updates here
            // Refresh products
            // await dispatch(search());
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