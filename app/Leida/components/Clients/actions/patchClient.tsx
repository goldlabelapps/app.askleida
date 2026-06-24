import type { T_RootState, T_UbereduxDispatch } from '../../../../NX/Uberedux/store';
import type { T_Client } from '../../../types';
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

const normalizeConcernTags = (value: unknown): string[] | undefined => {
    if (Array.isArray(value)) {
        return value
            .filter((item): item is string => typeof item === 'string')
            .map((item) => item.trim())
            .filter((item) => item.length > 0);
    }

    if (typeof value === 'string') {
        return value
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item.length > 0);
    }

    return undefined;
};

const getSortTimestamp = (value: unknown): number => {
    if (typeof value !== 'string') {
        return 0;
    }

    const time = Date.parse(value);
    return Number.isNaN(time) ? 0 : time;
};

const sortClientsByLastUpdated = (items: T_Client[]): T_Client[] => {
    return [...items].sort((a, b) => {
        const aUpdated = getSortTimestamp(a.updated) || getSortTimestamp(a.created) || getSortTimestamp(a.created_at);
        const bUpdated = getSortTimestamp(b.updated) || getSortTimestamp(b.created) || getSortTimestamp(b.created_at);
        return bUpdated - aUpdated;
    });
};

const extractClient = (payload: unknown): Partial<T_Client> | null => {
    if (!payload) {
        return null;
    }

    if (Array.isArray(payload)) {
        const first = payload[0];
        return first && typeof first === 'object' ? (first as Partial<T_Client>) : null;
    }

    if (typeof payload === 'object') {
        const record = payload as Record<string, unknown>;

        if (Array.isArray(record.data)) {
            const first = record.data[0];
            if (!first || typeof first !== 'object') {
                return null;
            }

            return first as Partial<T_Client>;
        }

        if (record.data && typeof record.data === 'object' && !Array.isArray(record.data)) {
            return record.data as Partial<T_Client>;
        }

        return record as Partial<T_Client>;
    }

    return null;
};

const getClientIdentity = (client: unknown): string => {
    if (!client || typeof client !== 'object') {
        return '';
    }

    const record = client as Record<string, unknown>;
    const clientId = typeof record.client_id === 'string' ? record.client_id.trim() : '';
    if (clientId) {
        return clientId;
    }

    const id = typeof record.id === 'string' ? record.id.trim() : '';
    return id;
};

export const patchClient = (
    clientId: string,
    client: Partial<T_Client>,
): any =>
    async (dispatch: T_UbereduxDispatch, getState: () => T_RootState) => {
        try {
            if (!clientId.trim()) {
                throw new Error('Missing client id');
            }

            const existingRes = await fetch(`/api/clients?id=${encodeURIComponent(clientId)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!existingRes.ok) {
                throw new Error(`Could not load client ${clientId}`);
            }

            const existingJson = await existingRes.json();
            const existingClient = extractClient(existingJson) || {};
            const existingData = toObject(existingClient.data);
            const incomingData = toObject(client.data);
            const mergedData = {
                ...existingData,
                ...incomingData,
            };

            const normalizedConcernTags = normalizeConcernTags(mergedData.concern_tags);
            if (normalizedConcernTags) {
                mergedData.concern_tags = normalizedConcernTags;
            } else {
                delete mergedData.concern_tags;
            }

            const payload: Partial<T_Client> & { client_id: string } = {
                client_id: clientId,
            };

            if (Object.prototype.hasOwnProperty.call(client, 'title')) {
                payload.title = normalizeText(client.title) ?? null;
            }

            if (Object.prototype.hasOwnProperty.call(client, 'display_name')) {
                payload.display_name = normalizeText(client.display_name);
            }


            if (Object.prototype.hasOwnProperty.call(client, 'email')) {
                payload.email = normalizeText(client.email);
            }

            if (Object.prototype.hasOwnProperty.call(client, 'skin_type')) {
                payload.skin_type = normalizeText(client.skin_type);
            }

            if (Object.prototype.hasOwnProperty.call(client, 'current_medication')) {
                payload.current_medication = normalizeText(client.current_medication);
            }

            if (Object.prototype.hasOwnProperty.call(client, 'skin_overview')) {
                payload.skin_overview = normalizeText(client.skin_overview);
            }

            if (Object.prototype.hasOwnProperty.call(client, 'personal_notes')) {
                payload.personal_notes = normalizeText(client.personal_notes);
            }

            if (Object.keys(mergedData).length > 0) {
                payload.data = mergedData;
            }

            const patchRes = await fetch('/api/clients', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const patchJson = await patchRes.json().catch(() => null);
            if (!patchRes.ok) {
                throw new Error(patchJson?.message || `Could not update client ${clientId}`);
            }

            const updatedClient = extractClient(patchJson) || { ...existingClient, ...payload };

            const state = getState();
            const clientsSlice = state?.redux?.clients || {};
            const currentList = Array.isArray(clientsSlice.list) ? clientsSlice.list : [];
            const updatedNow = new Date().toISOString();
            const nextList = currentList.map((listClient: T_Client) => {
                if (getClientIdentity(listClient) !== clientId) {
                    return listClient;
                }

                return {
                    ...listClient,
                    ...updatedClient,
                    updated: updatedNow,
                };
            });

            dispatch(setUbereduxKey({
                key: 'clients',
                value: {
                    ...clientsSlice,
                    list: sortClientsByLastUpdated(nextList),
                    error: null,
                },
            }));

            return true;
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setFeedback({
                title: 'Client Update Failed',
                description: msg,
                severity: 'error',
            }));
            dispatch(setUbereduxKey({ key: 'error', value: msg }));
            return false;
        }
    };