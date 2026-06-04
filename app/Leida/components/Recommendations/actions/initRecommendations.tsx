import { setRecommendations } from '../../Recommendations';
import { setFeedback } from '../../../../NX/DesignSystem';

export const initRecommendations = (practitionerId?: string): any =>
    async (dispatch: any) => {
        try {
            dispatch(setRecommendations('loading', true));
            dispatch(setRecommendations('error', null));

            const query = practitionerId
                ? `?practitioner_id=${encodeURIComponent(practitionerId)}`
                : '';
            const response = await fetch(`/api/recommendations${query}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch recommendations (${response.status})`);
            }

            const payload = await response.json();
            const list = Array.isArray(payload?.data) ? payload.data : [];

            dispatch(setRecommendations('list', list));
            dispatch(setRecommendations('initted', true));
            dispatch(setRecommendations('loading', false));
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setFeedback({
                title: 'Recommendations Load Failed',
                description: msg,
                severity: 'error',
            }));
            dispatch(setRecommendations('list', []));
            dispatch(setRecommendations('error', msg));
            dispatch(setRecommendations('initted', true));
            dispatch(setRecommendations('loading', false));
        }
    };
