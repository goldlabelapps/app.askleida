import type { T_RootState, T_UbereduxDispatch } from '../../../../NX/Uberedux/store';
import type { T_Product } from '../types';
import { setUbereduxKey } from '../../../../NX/Uberedux';
import { setFeedback } from '../../../../NX/DesignSystem';

const toObject = (value: unknown): Record<string, unknown> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    return value as Record<string, unknown>;
};

const normalizeText = (value: unknown): string | null | undefined => {
    if (value === undefined) {
        return undefined;
    }

    if (typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
};

const normalizePrice = (value: unknown): number | null | undefined => {
    if (value === undefined) {
        return undefined;
    }

    if (value === null || value === '') {
        return null;
    }

    const parsed = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(parsed) || parsed < 0) {
        return null;
    }

    return parsed;
};

const getSortTimestamp = (value: unknown): number => {
    if (typeof value !== 'string') {
        return 0;
    }

    const time = Date.parse(value);
    return Number.isNaN(time) ? 0 : time;
};

const sortProductsByLastUpdated = (items: T_Product[]): T_Product[] => {
    return [...items].sort((a, b) => {
        const aUpdated = getSortTimestamp(a.updated) || getSortTimestamp(a.created) || getSortTimestamp(a.created_at);
        const bUpdated = getSortTimestamp(b.updated) || getSortTimestamp(b.created) || getSortTimestamp(b.created_at);
        return bUpdated - aUpdated;
    });
};

const extractProduct = (payload: unknown): Partial<T_Product> | null => {
    if (!payload) {
        return null;
    }

    if (Array.isArray(payload)) {
        const first = payload[0];
        return first && typeof first === 'object' ? (first as Partial<T_Product>) : null;
    }

    if (typeof payload === 'object') {
        const record = payload as Record<string, unknown>;

        if (Array.isArray(record.data)) {
            const first = record.data[0];
            if (!first || typeof first !== 'object') {
                return null;
            }

            return first as Partial<T_Product>;
        }

        if (record.data && typeof record.data === 'object' && !Array.isArray(record.data)) {
            return record.data as Partial<T_Product>;
        }

        return record as Partial<T_Product>;
    }

    return null;
};

const getProductIdentity = (product: unknown): string => {
    if (!product || typeof product !== 'object') {
        return '';
    }

    const record = product as Record<string, unknown>;
    const productId = typeof record.product_id === 'string' ? record.product_id.trim() : '';
    if (productId) {
        return productId;
    }

    const id = typeof record.id === 'string' ? record.id.trim() : '';
    return id;
};

export const patchProduct = (
    productId: string,
    product: Partial<T_Product>,
): any =>
    async (dispatch: T_UbereduxDispatch, getState: () => T_RootState) => {
        try {
            if (!productId.trim()) {
                throw new Error('Missing product id');
            }

            const existingRes = await fetch(`/api/products?id=${encodeURIComponent(productId)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!existingRes.ok) {
                throw new Error(`Could not load product ${productId}`);
            }

            const existingJson = await existingRes.json();
            const existingProduct = extractProduct(existingJson) || {};
            const existingData = toObject(existingProduct.data);
            const incomingData = toObject(product.data);
            const mergedData = {
                ...existingData,
                ...incomingData,
            };

            const payload: Partial<T_Product> & { product_id: string } = {
                product_id: productId,
            };

            if (Object.prototype.hasOwnProperty.call(product, 'title')) payload.title = normalizeText(product.title) ?? null;
            if (Object.prototype.hasOwnProperty.call(product, 'name')) payload.name = normalizeText(product.name);
            if (Object.prototype.hasOwnProperty.call(product, 'category')) payload.category = normalizeText(product.category);
            if (Object.prototype.hasOwnProperty.call(product, 'sku')) payload.sku = normalizeText(product.sku);
            if (Object.prototype.hasOwnProperty.call(product, 'description')) payload.description = normalizeText(product.description);
            if (Object.prototype.hasOwnProperty.call(product, 'notes')) payload.notes = normalizeText(product.notes);
            if (Object.prototype.hasOwnProperty.call(product, 'price')) payload.price = normalizePrice(product.price);

            if (Object.keys(mergedData).length > 0) {
                payload.data = mergedData;
            }

            const patchRes = await fetch('/api/products', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const patchJson = await patchRes.json().catch(() => null);
            if (!patchRes.ok) {
                throw new Error(patchJson?.message || `Could not update product ${productId}`);
            }

            const updatedProduct = extractProduct(patchJson) || { ...existingProduct, ...payload };

            const state = getState();
            const productsSlice = state?.redux?.products || {};
            const currentList = Array.isArray(productsSlice.list) ? productsSlice.list : [];
            const updatedNow = new Date().toISOString();
            const nextList = currentList.map((listProduct: T_Product) => {
                if (getProductIdentity(listProduct) !== productId) {
                    return listProduct;
                }

                return {
                    ...listProduct,
                    ...updatedProduct,
                    updated: updatedNow,
                };
            });

            dispatch(setUbereduxKey({
                key: 'products',
                value: {
                    ...productsSlice,
                    list: sortProductsByLastUpdated(nextList),
                    error: null,
                },
            }));

            return true;
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setFeedback({
                title: 'Product Update Failed',
                description: msg,
                severity: 'error',
            }));
            dispatch(setUbereduxKey({ key: 'error', value: msg }));
            return false;
        }
    };
