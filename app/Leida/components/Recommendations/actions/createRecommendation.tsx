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

const normalizeText = (value: unknown): string | null => {
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

const extractRecommendation = (payload: unknown): T_Recommendation | null => {
    if (!payload || typeof payload !== 'object') {
        return null;
    }

    const record = payload as Record<string, unknown>;

    if (Array.isArray(record.data)) {
        const first = record.data[0];
        return first && typeof first === 'object' ? (first as T_Recommendation) : null;
    }

    if (record.data && typeof record.data === 'object' && !Array.isArray(record.data)) {
        return record.data as T_Recommendation;
    }

    return record as T_Recommendation;
};

export const createRecommendation = (recommendation: Partial<T_Recommendation>): any =>
    async (dispatch: T_UbereduxDispatch, getState: () => T_RootState) => {
        try {
            const data = toObject(recommendation.data);
            const clientName = normalizeText(data.client_name) || normalizeText(recommendation.title);
            const title = normalizeText(recommendation.title) || clientName || 'New recommendation';

            const payload: Partial<T_Recommendation> = {
                ...recommendation,
                title,
                data: {
                    ...data,
                    client_id: normalizeText(data.client_id),
                    client_name: clientName,
                    therapist_context: normalizeText(data.therapist_context),
                    tips: normalizeText(data.tips),
                    draft: normalizeText(data.draft),
                    export_url: normalizeText(data.export_url),
                },
            };

            const response = await fetch('/api/recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const responsePayload = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(responsePayload?.message || `Failed to create recommendation (${response.status})`);
            }

            const createdRecommendation = extractRecommendation(responsePayload);
            if (!createdRecommendation) {
                throw new Error('Recommendation created but response payload was empty');
            }

            const state = getState();
            const recommendationsSlice = state?.redux?.recommendations || {};
            const list = Array.isArray(recommendationsSlice.list) ? recommendationsSlice.list : [];
            const updatedList = sortRecommendationsByLastUpdated([createdRecommendation, ...list]);

            dispatch(
                setUbereduxKey({
                    key: 'recommendations',
                    value: {
                        ...recommendationsSlice,
                        list: updatedList,
                        error: null,
                    },
                }),
            );

            const newRecommendationId =
                (createdRecommendation as Record<string, unknown>).recommendation_id ||
                (createdRecommendation as Record<string, unknown>).id ||
                null;

            return typeof newRecommendationId === 'string' ? newRecommendationId : null;
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setFeedback({
                title: 'Recommendation Create Failed',
                description: msg,
                severity: 'error',
            }));
            dispatch(setUbereduxKey({ key: 'error', value: msg }));
            return null;
        }
    };
