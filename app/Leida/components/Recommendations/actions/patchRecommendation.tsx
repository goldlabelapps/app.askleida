import type { T_RootState, T_UbereduxDispatch } from '../../../../NX/Uberedux/store';
import type { T_Recommendation } from '../types';
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

const getSortTimestamp = (value: unknown): number => {
    if (typeof value !== 'string') {
        return 0;
    }

    const time = Date.parse(value);
    return Number.isNaN(time) ? 0 : time;
};

const sortRecommendationsByLastUpdated = (items: T_Recommendation[]): T_Recommendation[] => {
    return [...items].sort((a, b) => {
        const aUpdated = getSortTimestamp(a.updated) || getSortTimestamp(a.created) || getSortTimestamp(a.created_at);
        const bUpdated = getSortTimestamp(b.updated) || getSortTimestamp(b.created) || getSortTimestamp(b.created_at);
        return bUpdated - aUpdated;
    });
};

const extractRecommendation = (payload: unknown): Partial<T_Recommendation> | null => {
    if (!payload) {
        return null;
    }

    if (Array.isArray(payload)) {
        const first = payload[0];
        return first && typeof first === 'object' ? (first as Partial<T_Recommendation>) : null;
    }

    if (typeof payload === 'object') {
        const record = payload as Record<string, unknown>;

        if (Array.isArray(record.data)) {
            const first = record.data[0];
            if (!first || typeof first !== 'object') {
                return null;
            }

            return first as Partial<T_Recommendation>;
        }

        if (record.data && typeof record.data === 'object' && !Array.isArray(record.data)) {
            return record.data as Partial<T_Recommendation>;
        }

        return record as Partial<T_Recommendation>;
    }

    return null;
};

const getRecommendationIdentity = (recommendation: unknown): string => {
    if (!recommendation || typeof recommendation !== 'object') {
        return '';
    }

    const record = recommendation as Record<string, unknown>;
    const recommendationId = typeof record.recommendation_id === 'string' ? record.recommendation_id.trim() : '';
    if (recommendationId) {
        return recommendationId;
    }

    const id = typeof record.id === 'string' ? record.id.trim() : '';
    return id;
};

export const patchRecommendation = (
    recommendationId: string,
    recommendation: Partial<T_Recommendation>,
): any =>
    async (dispatch: T_UbereduxDispatch, getState: () => T_RootState) => {
        try {
            if (!recommendationId.trim()) {
                throw new Error('Missing recommendation id');
            }

            const existingRes = await fetch(`/api/recommendations?id=${encodeURIComponent(recommendationId)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!existingRes.ok) {
                throw new Error(`Could not load recommendation ${recommendationId}`);
            }

            const existingJson = await existingRes.json();
            const existingRecommendation = extractRecommendation(existingJson) || {};
            const existingData = toObject(existingRecommendation.data);
            const incomingData = toObject(recommendation.data);
            const mergedData = {
                ...existingData,
                ...incomingData,
            };

            const payload: Partial<T_Recommendation> & { recommendation_id: string } = {
                recommendation_id: recommendationId,
            };

            if (Object.prototype.hasOwnProperty.call(recommendation, 'title')) {
                payload.title = normalizeText(recommendation.title) ?? null;
            }

            if (Object.prototype.hasOwnProperty.call(recommendation, 'practitioner_id')) {
                payload.practitioner_id = normalizeText(recommendation.practitioner_id);
            }

            if (Object.keys(mergedData).length > 0) {
                payload.data = mergedData;
            }

            const patchRes = await fetch('/api/recommendations', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const patchJson = await patchRes.json().catch(() => null);
            if (!patchRes.ok) {
                throw new Error(patchJson?.message || `Could not update recommendation ${recommendationId}`);
            }

            const updatedRecommendation = extractRecommendation(patchJson) || { ...existingRecommendation, ...payload };

            const state = getState();
            const recommendationsSlice = state?.redux?.recommendations || {};
            const currentList = Array.isArray(recommendationsSlice.list) ? recommendationsSlice.list : [];
            const updatedNow = new Date().toISOString();
            const nextList = currentList.map((listRecommendation: T_Recommendation) => {
                if (getRecommendationIdentity(listRecommendation) !== recommendationId) {
                    return listRecommendation;
                }

                return {
                    ...listRecommendation,
                    ...updatedRecommendation,
                    updated: updatedNow,
                };
            });

            dispatch(setUbereduxKey({
                key: 'recommendations',
                value: {
                    ...recommendationsSlice,
                    list: sortRecommendationsByLastUpdated(nextList),
                    error: null,
                },
            }));

            return true;
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setFeedback({
                title: 'Recommendation Update Failed',
                description: msg,
                severity: 'error',
            }));
            dispatch(setUbereduxKey({ key: 'error', value: msg }));
            return false;
        }
    };
