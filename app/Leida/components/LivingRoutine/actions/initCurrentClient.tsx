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
        console.log('[initCurrentClient] start', {
            clientId,
            normalizedClientId,
            email,
            normalizedEmail,
        });

        if (!normalizedClientId && !normalizedEmail) {
            console.log('[initCurrentClient] abort: missing client id');
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
                const clientUrl = `/api/clients?id=${encodeURIComponent(normalizedClientId)}`;
                console.log('[initCurrentClient] fetching client by id', { clientUrl });
                const clientRes = await fetch(clientUrl, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const clientJson = await clientRes.json();
                console.log('[initCurrentClient] client-by-id response', {
                    ok: clientRes.ok,
                    status: clientRes.status,
                    body: clientJson,
                });

                if (clientRes.ok) {
                    currentClient = toObject(clientJson?.data);
                } else if (normalizedEmail) {
                    console.log('[initCurrentClient] client id lookup failed, retrying by email');
                } else {
                    throw new Error(clientJson?.meta?.message || 'Failed to fetch client');
                }
            }

            if ((!currentClient.client_id || typeof currentClient.client_id !== 'string') && normalizedEmail) {
                const clientByEmailUrl = `/api/clients?email=${encodeURIComponent(normalizedEmail)}`;
                console.log('[initCurrentClient] fetching client by email', { clientByEmailUrl });
                const clientByEmailRes = await fetch(clientByEmailUrl, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const clientByEmailJson = await clientByEmailRes.json();
                console.log('[initCurrentClient] client-by-email response', {
                    ok: clientByEmailRes.ok,
                    status: clientByEmailRes.status,
                    body: clientByEmailJson,
                });

                if (!clientByEmailRes.ok) {
                    throw new Error(clientByEmailJson?.meta?.message || 'Failed to fetch client by email');
                }

                const rows = Array.isArray(clientByEmailJson?.data) ? clientByEmailJson.data : [];
                currentClient = toObject(rows[0]);
            }

            if (!currentClient.client_id || typeof currentClient.client_id !== 'string') {
                throw new Error('Client not found for provided id/email');
            }

            console.log('[initCurrentClient] currentClient parsed', currentClient);
            dispatch(setLivingRoutine('currentClient', currentClient));

            const practitionerId = typeof currentClient?.practitioner_id === 'string'
                ? currentClient.practitioner_id.trim()
                : '';
            console.log('[initCurrentClient] practitioner_id derived', { practitionerId });

            if (!practitionerId) {
                throw new Error('Client record has no practitioner_id');
            }

            const practitionerUrl = `/api/practitioner?id=${encodeURIComponent(practitionerId)}`;
            console.log('[initCurrentClient] fetching practitioner', { practitionerUrl });
            const practitionerRes = await fetch(`/api/practitioner?id=${encodeURIComponent(practitionerId)}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const practitionerJson = await practitionerRes.json();
            console.log('[initCurrentClient] practitioner response', {
                ok: practitionerRes.ok,
                status: practitionerRes.status,
                body: practitionerJson,
            });

            if (!practitionerRes.ok) {
                throw new Error(practitionerJson?.meta?.message || 'Failed to fetch practitioner');
            }

            console.log('[initCurrentClient] success: practitioner saved');
            dispatch(setLivingRoutine('practitioner', practitionerJson?.data ?? null));
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Failed to load practitioner';
            console.log('[initCurrentClient] error', { message: msg, error: e });
            dispatch(setLivingRoutine('currentClient', null));
            dispatch(setLivingRoutine('practitioner', null));
            dispatch(setLivingRoutine('practitionerError', msg));
        } finally {
            console.log('[initCurrentClient] done');
            dispatch(setLivingRoutine('practitionerLoading', false));
        }
    };
