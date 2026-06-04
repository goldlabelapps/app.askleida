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

const normalizeText = (value: unknown): string | null => {
    if (typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
};

const normalizePrice = (value: unknown): number | null => {
    if (value === null || value === undefined || value === '') {
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

const extractProduct = (payload: unknown): T_Product | null => {
    if (!payload || typeof payload !== 'object') {
        return null;
    }

    const record = payload as Record<string, unknown>;

    if (Array.isArray(record.data)) {
        const first = record.data[0];
        return first && typeof first === 'object' ? (first as T_Product) : null;
    }

    if (record.data && typeof record.data === 'object' && !Array.isArray(record.data)) {
        return record.data as T_Product;
    }

    return record as T_Product;
};

export const createProduct = (product: Partial<T_Product>): any =>
    async (dispatch: T_UbereduxDispatch, getState: () => T_RootState) => {
        try {
            const data = toObject(product.data);
            const name = normalizeText(product.name ?? data.name);
            const category = normalizeText(product.category ?? data.category);
            const sku = normalizeText(product.sku ?? data.sku);
            const description = normalizeText(product.description ?? data.description);
            const notes = normalizeText(product.notes ?? data.notes);
            const price = normalizePrice(product.price ?? data.price);
            const title = normalizeText(product.title) || name || 'New product';

            const payload: Partial<T_Product> = {
                ...product,
                title,
                name,
                category,
                sku,
                price,
                description,
                notes,
                data: {
                    ...data,
                    name,
                    category,
                    sku,
                    price,
                    description,
                    notes,
                },
            };

            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const responsePayload = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(responsePayload?.message || `Failed to create product (${response.status})`);
            }

            const createdProduct = extractProduct(responsePayload);
            if (!createdProduct) {
                throw new Error('Product created but response payload was empty');
            }

            const state = getState();
            const productsSlice = state?.redux?.products || {};
            const list = Array.isArray(productsSlice.list) ? productsSlice.list : [];
            const updatedList = sortProductsByLastUpdated([createdProduct, ...list]);

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

            const newProductId =
                (createdProduct as Record<string, unknown>).product_id ||
                (createdProduct as Record<string, unknown>).id ||
                null;

            return typeof newProductId === 'string' ? newProductId : null;
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setFeedback({
                title: 'Product Create Failed',
                description: msg,
                severity: 'error',
            }));
            dispatch(setUbereduxKey({ key: 'error', value: msg }));
            return null;
        }
    };
