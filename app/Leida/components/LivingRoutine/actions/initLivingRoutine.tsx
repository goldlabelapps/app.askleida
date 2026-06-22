import { setFeedback } from '../../../../NX/DesignSystem';
import { setLivingRoutine } from '../../../../Leida';

const toObject = (value: unknown): Record<string, unknown> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    return value as Record<string, unknown>;
};

export const initLivingRoutine = (clientId?: string): any =>
    async (dispatch: any) => {
        try {
            const normalizedClientId = typeof clientId === 'string' ? clientId.trim() : '';
            if (!normalizedClientId) {
                throw new Error('Missing client id');
            }

            dispatch(setLivingRoutine('loading', true));
            dispatch(setLivingRoutine('error', null));

            const response = await fetch(`/api/clients?id=${encodeURIComponent(normalizedClientId)}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch living routine (${response.status})`);
            }

            const payload = await response.json();
            const client = toObject(payload?.data);
            const clientData = toObject(client.data);
            const routine = clientData.livingRoutine ?? null;

            dispatch(setLivingRoutine('clientId', normalizedClientId));
            dispatch(setLivingRoutine('client', client));
            dispatch(setLivingRoutine('routine', routine));
            dispatch(setLivingRoutine('initted', true));
            dispatch(setLivingRoutine('loading', false));
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setFeedback({
                title: 'Living Routine Load Failed',
                description: msg,
                severity: 'error',
            }));
            dispatch(setLivingRoutine('client', null));
            dispatch(setLivingRoutine('routine', null));
            dispatch(setLivingRoutine('error', msg));
            dispatch(setLivingRoutine('initted', true));
            dispatch(setLivingRoutine('loading', false));
        }
    };
