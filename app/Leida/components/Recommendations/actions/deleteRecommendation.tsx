import { setFeedback } from '../../../../NX/DesignSystem';
import { setUbereduxKey } from '../../../../NX/Uberedux';

const getSortTimestamp = (value: unknown): number => {
    if (typeof value !== 'string') {
        return 0;
    }

    const time = Date.parse(value);
    return Number.isNaN(time) ? 0 : time;
};

const sortByLastUpdated = (items: any[]): any[] => {
    return [...items].sort((a, b) => {
        const aUpdated = getSortTimestamp(a.updated) || getSortTimestamp(a.created) || getSortTimestamp(a.created_at);
        const bUpdated = getSortTimestamp(b.updated) || getSortTimestamp(b.created) || getSortTimestamp(b.created_at);
        return bUpdated - aUpdated;
    });
};

export const deleteRecommendation = (recommendationId: string): any =>
    async (dispatch: any, getState: () => any) => {
        try {
            if (!recommendationId.trim()) {
                throw new Error('Missing recommendation id');
            }

            const response = await fetch('/api/recommendations', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recommendation_id: recommendationId }),
            });

            const responsePayload = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(responsePayload?.message || `Failed to delete recommendation ${recommendationId}`);
            }

            const state = getState();
            const recommendationsSlice = state?.redux?.recommendations || {};
            const currentList = Array.isArray(recommendationsSlice.list) ? recommendationsSlice.list : [];
            const nextList = currentList.filter((recommendation: any) => {
                const candidateId = typeof recommendation?.recommendation_id === 'string'
                    ? recommendation.recommendation_id
                    : typeof recommendation?.id === 'string'
                        ? recommendation.id
                        : '';
                return candidateId !== recommendationId;
            });

            dispatch(setUbereduxKey({
                key: 'recommendations',
                value: {
                    ...recommendationsSlice,
                    list: sortByLastUpdated(nextList),
                    error: null,
                },
            }));

            return true;
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setFeedback({
                title: 'Recommendation Delete Failed',
                description: msg,
                severity: 'error',
            }));
            dispatch(setUbereduxKey({ key: 'error', value: msg }));
            return false;
        }
    };
