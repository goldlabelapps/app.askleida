import type { T_RootState, T_UbereduxDispatch } from '../../../../NX/Uberedux/store';
import { setUbereduxKey } from '../../../../NX/Uberedux';
import { setFeedback } from '../../../../NX/DesignSystem';

export const deleteProduct = (productId: string): any =>
    async (dispatch: T_UbereduxDispatch, getState: () => T_RootState) => {
        try {
            if (!productId.trim()) {
                throw new Error('Missing product id');
            }

            const response = await fetch('/api/products', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ product_id: productId }),
            });

            const payload = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(payload?.message || `Failed to delete product (${response.status})`);
            }

            const state = getState();
            const productsSlice = state?.redux?.products || {};
            const list = Array.isArray(productsSlice.list) ? productsSlice.list : [];
            const updatedList = list.filter((product: any) => {
                const candidateId =
                    typeof product?.product_id === 'string'
                        ? product.product_id
                        : typeof product?.id === 'string'
                            ? product.id
                            : null;
                return candidateId !== productId;
            });

            dispatch(
                setUbereduxKey({
                    key: 'products',
                    value: {
                        ...productsSlice,
                        list: updatedList,
                        error: null,
                    },
                }),
            );

            return true;
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setFeedback({
                title: 'Product Delete Failed',
                description: msg,
                severity: 'error',
            }));
            dispatch(setUbereduxKey({ key: 'error', value: msg }));
            return false;
        }
    };