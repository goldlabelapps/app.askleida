import type { T_RootState, T_UbereduxDispatch } from '../../../../NX/Uberedux/store';
import type { T_Tip } from '../types';
import { setUbereduxKey } from '../../../../NX/Uberedux';

const toObject = (value: unknown): Record<string, unknown> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    return value as Record<string, unknown>;
};

const extractTip = (payload: unknown): Partial<T_Tip> | null => {
    if (!payload) {
        return null;
    }

    if (Array.isArray(payload)) {
        const first = payload[0];
        if (!first || typeof first !== 'object') {
            return null;
        }
        return first as Partial<T_Tip>;
    }

    if (typeof payload === 'object') {
        const record = payload as Record<string, unknown>;

        if (Array.isArray(record.data)) {
            const first = record.data[0];
            if (!first || typeof first !== 'object') {
                return null;
            }
            return first as Partial<T_Tip>;
        }

        if (record.data && typeof record.data === 'object' && !Array.isArray(record.data)) {
            return record.data as Partial<T_Tip>;
        }

        return record as Partial<T_Tip>;
    }

    return null;
};

const getTipIdentity = (tip: unknown): string => {
    if (!tip || typeof tip !== 'object') {
        return '';
    }

    const record = tip as Record<string, unknown>;
    const tipId = typeof record.tip_id === 'string' ? record.tip_id.trim() : '';
    if (tipId) {
        return tipId;
    }

    const id = typeof record.id === 'string' ? record.id.trim() : '';
    return id;
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

export const patchTip = (
    tipId: string,
    tip: Partial<T_Tip>,
): any =>
    async (dispatch: T_UbereduxDispatch, getState: () => T_RootState) => {
        try {
            if (!tipId.trim()) {
                throw new Error('Missing tip id');
            }

            const existingRes = await fetch(`/api/tips?tip_id=${encodeURIComponent(tipId)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!existingRes.ok) {
                throw new Error(`Could not load tip ${tipId}`);
            }

            const existingJson = await existingRes.json();
            const existingTip = extractTip(existingJson) || {};
            const existingData = toObject(existingTip.data);
            const incomingData = toObject(tip.data);
            const mergedData = {
                ...existingData,
                ...incomingData,
            };

            const payload: Partial<T_Tip> & { tip_id: string } = {
                tip_id: tipId,
            };

            if (Object.prototype.hasOwnProperty.call(tip, 'title')) {
                payload.title = tip.title ?? null;
            }

            if (Object.keys(mergedData).length > 0) {
                payload.data = mergedData;
            }

            const patchRes = await fetch('/api/tips', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!patchRes.ok) {
                const errBody = await patchRes.text();
                throw new Error(errBody || `Could not update tip ${tipId}`);
            }

            const state = getState();
            const tipsSlice = state?.redux?.tips || {};
            const currentList = Array.isArray(tipsSlice.list) ? tipsSlice.list : [];
            const updatedNow = new Date().toISOString();
            const nextList = currentList.map((listTip: T_Tip) => {
                if (getTipIdentity(listTip) !== tipId) {
                    return listTip;
                }

                return {
                    ...listTip,
                    updated: updatedNow,
                    ...(Object.prototype.hasOwnProperty.call(payload, 'title') ? { title: payload.title } : {}),
                    ...(Object.prototype.hasOwnProperty.call(payload, 'data') ? { data: payload.data } : {}),
                };
            });

            dispatch(setUbereduxKey({
                key: 'tips',
                value: {
                    ...tipsSlice,
                    list: sortTipsByLastUpdated(nextList),
                },
            }));

            return true;
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setUbereduxKey({ key: 'error', value: msg }));
            return false;
        }
    };