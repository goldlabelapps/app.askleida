import type { Dispatch } from 'redux';
import { setUbereduxKey } from '../../Uberedux';
import { setFeedback } from '../../DesignSystem';
import { setKey, search } from '../../Products';

export const deleteProduct = (product_id: number): any =>
    async (dispatch: Dispatch, getState: () => any) => {
        try {
            dispatch(setKey('loading', true));
            const res = await fetch('/api/products', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id }),
            });
            const data = await res.json();

            if (!res.ok || data?.severity === 'error') {
                dispatch(setFeedback({
                    title: data?.message || 'Failed to delete product',
                    severity: 'error',
                }));
                dispatch(setKey('loading', false));
                return;
            }
            dispatch(setFeedback({
                title: 'Product deleted successfully',
                severity: 'success',
            }));
            // Refresh products
            dispatch(search() as any);
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