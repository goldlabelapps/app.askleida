import type { T_RootState, T_UbereduxDispatch } from '../../../../NX/Uberedux/store';
import type { T_Tip } from '../types';
import { setUbereduxKey } from '../../../../NX/Uberedux';

const toObject = (value: unknown): Record<string, unknown> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    return value as Record<string, unknown>;
};

const normalizeBullets = (value: unknown): string[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
};

const getSortTimestamp = (value: unknown): number => {
    if (typeof value !== 'string') {
        return 0;
    }

    const time = Date.parse(value);
    return Number.isNaN(time) ? 0 : time;
};

const sortTipsByLastUpdated = (items: T_Tip[]): T_Tip[] => {
    return [...items].sort((a, b) => {
        const aUpdated = getSortTimestamp(a.updated) || getSortTimestamp(a.created);
        const bUpdated = getSortTimestamp(b.updated) || getSortTimestamp(b.created);
        return bUpdated - aUpdated;
    });
};

const extractCreatedTip = (payload: unknown): T_Tip | null => {
    if (!payload || typeof payload !== 'object') {
        return null;
    }

    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.data)) {
        const first = record.data[0];
        return first && typeof first === 'object' ? (first as T_Tip) : null;
    }

    if (record.data && typeof record.data === 'object' && !Array.isArray(record.data)) {
        return record.data as T_Tip;
    }

    return record as T_Tip;
};

export const createTip = (tip: Partial<T_Tip>): any =>
        async (dispatch: T_UbereduxDispatch, getState: () => T_RootState) => {
            try {
                const normalizedTitle = typeof tip.title === 'string' ? tip.title.trim() : '';
                if (!normalizedTitle) {
                    throw new Error('Missing tip title');
                }

                const data = toObject(tip.data);
                const normalizedBullets = normalizeBullets(data.bullets);
                if (normalizedBullets.length === 0) {
                    throw new Error('At least one bullet is required');
                }

                const requestPayload: Partial<T_Tip> = {
                    ...tip,
                    title: normalizedTitle,
                    data: {
                        ...data,
                        bullets: normalizedBullets,
                    },
                };

                const response = await fetch('/api/tips', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify(requestPayload),
                });

                const responsePayload = await response.json().catch(() => null);
                if (!response.ok) {
                    throw new Error(responsePayload?.message || `Failed to create tip (${response.status})`);
                }

                const createdTip = extractCreatedTip(responsePayload);
                if (!createdTip) {
                    throw new Error('Tip created but response payload was empty');
                }

                const state = getState();
                const tipsSlice = state?.redux?.tips || {};
                const list = Array.isArray(tipsSlice.list) ? tipsSlice.list : [];
                const updatedList = sortTipsByLastUpdated([createdTip, ...list]);

                dispatch(
                    setUbereduxKey({
                        key: 'tips',
                        value: {
                            ...tipsSlice,
                            list: updatedList,
                            error: null,
                        },
                    }),
                );

                return true;
            } catch (e: unknown) {
                const msg = e instanceof Error ? e.message : String(e);
                dispatch(setUbereduxKey({ key: 'error', value: msg }));
                return false;
            }
        };

        