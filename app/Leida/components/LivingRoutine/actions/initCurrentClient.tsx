import { setLivingRoutine } from '../../../../Leida';

const toObject = (value: unknown): Record<string, unknown> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    return value as Record<string, unknown>;
};

export const initCurrentClient = (clientId?: string, email?: string): any =>
    async (dispatch: any) => {
        const normalizedClientId = typeof clientId === 'string' ? clientId.trim() : '';
        const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
        if (!normalizedClientId && !normalizedEmail) {
            dispatch(setLivingRoutine('currentClient', null));
            dispatch(setLivingRoutine('practitioner', null));
            dispatch(setLivingRoutine('practitionerLoading', false));
            dispatch(setLivingRoutine('practitionerError', 'Missing client id and email'));
            return;
        }
        dispatch(setLivingRoutine('practitionerLoading', true));
        dispatch(setLivingRoutine('practitionerError', null));

        try {
            let currentClient: Record<string, unknown> = {};

            if (normalizedClientId) {
                const clientUrl = `/api/clients?client_id=${encodeURIComponent(normalizedClientId)}`;
                const clientRes = await fetch(clientUrl, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const clientJson = await clientRes.json();
                if (clientRes.ok) {
                    currentClient = toObject(clientJson?.data);
                } else if (normalizedEmail) {
                } else {
                    throw new Error(clientJson?.meta?.message || 'Failed to fetch client');
                }
            }

            if ((!currentClient.client_id || typeof currentClient.client_id !== 'string') && normalizedEmail) {
                const clientByEmailUrl = `/api/clients?email=${encodeURIComponent(normalizedEmail)}`;
                const clientByEmailRes = await fetch(clientByEmailUrl, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const clientByEmailJson = await clientByEmailRes.json();

                if (!clientByEmailRes.ok) {
                    throw new Error(clientByEmailJson?.meta?.message || 'Failed to fetch client by email');
                }

                const rows = Array.isArray(clientByEmailJson?.data) ? clientByEmailJson.data : [];
                currentClient = toObject(rows[0]);
            }

            if (!currentClient.client_id || typeof currentClient.client_id !== 'string') {
                throw new Error('Client not found for provided id/email');
            }

            dispatch(setLivingRoutine('currentClient', currentClient));

            const practitionerId = typeof currentClient?.practitioner_id === 'string'
                ? currentClient.practitioner_id.trim()
                : '';

            if (!practitionerId) {
                throw new Error('Client record has no practitioner_id');
            }

            const practitionerUrl = `/api/practitioner?id=${encodeURIComponent(practitionerId)}`;
            const practitionerRes = await fetch(`/api/practitioner?id=${encodeURIComponent(practitionerId)}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const practitionerJson = await practitionerRes.json();

            if (!practitionerRes.ok) {
                throw new Error(practitionerJson?.meta?.message || 'Failed to fetch practitioner');
            }
            dispatch(setLivingRoutine('practitioner', practitionerJson?.data ?? null));
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Failed to load practitioner';
            dispatch(setLivingRoutine('currentClient', null));
            dispatch(setLivingRoutine('practitioner', null));
            dispatch(setLivingRoutine('practitionerError', msg));
        } finally {
            dispatch(setLivingRoutine('practitionerLoading', false));
        }
    };
