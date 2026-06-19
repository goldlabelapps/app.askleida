import type { T_RootState, T_UbereduxDispatch } from '../../../../NX/Uberedux/store';
import type { T_Client } from '../types';
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

const deriveTitleFromEmail = (email: string | null): string => {
    if (!email) {
        return 'New client';
    }

    const localPart = email.split('@')[0]?.trim() || '';
    if (!localPart) {
        return 'New client';
    }

    const spaced = localPart
        .replace(/[._-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (!spaced) {
        return 'New client';
    }

    return spaced
        .split(' ')
        .map((word) => word ? `${word[0].toUpperCase()}${word.slice(1)}` : '')
        .join(' ')
        .trim() || 'New client';
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

const extractClient = (payload: unknown): T_Client | null => {
    if (!payload || typeof payload !== 'object') {
        return null;
    }

    const record = payload as Record<string, unknown>;

    if (Array.isArray(record.data)) {
        const first = record.data[0];
        return first && typeof first === 'object' ? (first as T_Client) : null;
    }

    if (record.data && typeof record.data === 'object' && !Array.isArray(record.data)) {
        return record.data as T_Client;
    }

    return record as T_Client;
};

export const createClient = (client: Partial<T_Client>): any =>
    async (dispatch: T_UbereduxDispatch, getState: () => T_RootState) => {
        try {
            const data = toObject(client.data);
            const email = normalizeText(client.email ?? data.email)?.toLowerCase() ?? null;
            const title = deriveTitleFromEmail(email);

            const payload: Partial<T_Client> = {
                ...client,
                title,
                email,
                data: {
                    ...data,
                    email,
                    display_name: title,
                },
            };

            const response = await fetch('/api/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const responsePayload = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(responsePayload?.message || `Failed to create client (${response.status})`);
            }

            const createdClient = extractClient(responsePayload);
            if (!createdClient) {
                throw new Error('Client created but response payload was empty');
            }

            const state = getState();
            const clientsSlice = state?.redux?.clients || {};
            const list = Array.isArray(clientsSlice.list) ? clientsSlice.list : [];
            const updatedList = sortClientsByLastUpdated([createdClient, ...list]);

            dispatch(
                setUbereduxKey({
                    key: 'clients',
                    value: {
                        ...clientsSlice,
                        list: updatedList,
                        error: null,
                    },
                }),
            );

            const newClientId =
                (createdClient as Record<string, unknown>).client_id ||
                (createdClient as Record<string, unknown>).id ||
                null;

            return typeof newClientId === 'string' ? newClientId : null;
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setFeedback({
                title: 'Client Create Failed',
                description: msg,
                severity: 'error',
            }));
            dispatch(setUbereduxKey({ key: 'error', value: msg }));
            return null;
        }
    };