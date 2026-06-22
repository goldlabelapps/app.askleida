import type { T_RootState, T_UbereduxDispatch } from '../../../../NX/Uberedux/store';
import { setUbereduxKey } from '../../../../NX/Uberedux';
import { setFeedback } from '../../../../NX/DesignSystem';
import { LIVING_ROUTINE_KEY } from '../lib/constants';

const toObject = (value: unknown): Record<string, unknown> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    return value as Record<string, unknown>;
};

const extractClient = (payload: unknown): Record<string, unknown> | null => {
    if (!payload || typeof payload !== 'object') {
        return null;
    }

    const record = payload as Record<string, unknown>;

    if (Array.isArray(record.data)) {
        const first = record.data[0];
        return first && typeof first === 'object' ? (first as Record<string, unknown>) : null;
    }

    if (record.data && typeof record.data === 'object' && !Array.isArray(record.data)) {
        return record.data as Record<string, unknown>;
    }

    return record;
};

export const createLivingRoutine = (
    clientId: string,
    routine: Record<string, unknown>,
): any =>
    async (dispatch: T_UbereduxDispatch, getState: () => T_RootState) => {
        try {
            const normalizedClientId = clientId.trim();
            if (!normalizedClientId) {
                throw new Error('Missing client id');
            }

            const existingRes = await fetch(`/api/clients?id=${encodeURIComponent(normalizedClientId)}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            });

            if (!existingRes.ok) {
                throw new Error(`Could not load client ${normalizedClientId}`);
            }

            const existingJson = await existingRes.json();
            const existingClient = extractClient(existingJson) || {};
            const existingData = toObject(existingClient.data);

            const patchRes = await fetch('/api/clients', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    client_id: normalizedClientId,
                    data: {
                        ...existingData,
                        [LIVING_ROUTINE_KEY]: routine,
                    },
                }),
            });

            const patchJson = await patchRes.json().catch(() => null);
            if (!patchRes.ok) {
                throw new Error(patchJson?.message || `Could not create living routine for ${normalizedClientId}`);
            }

            const updatedClient = extractClient(patchJson) || existingClient;
            const updatedData = toObject(updatedClient.data);
            const nextRoutine = updatedData[LIVING_ROUTINE_KEY] ?? null;

            const state = getState();
            const current = state?.redux?.livingRoutine || {};
            dispatch(setUbereduxKey({
                key: 'livingRoutine',
                value: {
                    ...current,
                    clientId: normalizedClientId,
                    client: updatedClient,
                    routine: nextRoutine,
                    error: null,
                },
            }));

            return true;
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setFeedback({
                title: 'Living Routine Create Failed',
                description: msg,
                severity: 'error',
            }));
            dispatch(setUbereduxKey({ key: 'error', value: msg }));
            return false;
        }
    };
