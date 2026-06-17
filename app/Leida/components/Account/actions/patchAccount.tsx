import type { T_RootState, T_UbereduxDispatch } from '../../../../NX/Uberedux/store';
import { setUbereduxKey } from '../../../../NX/Uberedux';
import { setAccount } from './setAccount';

type T_PatchPractitionerPayload = {
    data?: Record<string, unknown>;
    [key: string]: unknown;
};

const toObject = (value: unknown): Record<string, unknown> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    return value as Record<string, unknown>;
};

const extractPractitioner = (payload: unknown): Record<string, unknown> | null => {
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

export const patchAccount = (
    practitionerId: string,
    practitioner: T_PatchPractitionerPayload,
): any =>
    async (dispatch: T_UbereduxDispatch, getState: () => T_RootState) => {
        try {
            if (!practitionerId.trim()) {
                throw new Error('Missing practitioner id');
            }

            const state = getState();
            const practitionerSlice = state?.redux?.practitioner || {};
            const rows = Array.isArray(practitionerSlice.data) ? practitionerSlice.data : [];
            const currentRow = rows[0] && typeof rows[0] === 'object'
                ? rows[0] as Record<string, unknown>
                : {};

            const payload: Record<string, unknown> = {
                ...practitioner,
                practitioner_id: practitionerId,
            };

            if (Object.prototype.hasOwnProperty.call(practitioner, 'data')) {
                const currentData = toObject(currentRow.data);
                const incomingData = toObject(practitioner.data);
                payload.data = {
                    ...currentData,
                    ...incomingData,
                };
            }

            const response = await fetch('/api/practitioner', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const responsePayload = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(responsePayload?.message || `Failed to update practitioner (${response.status})`);
            }

            const updatedRow = extractPractitioner(responsePayload) || {
                ...currentRow,
                ...payload,
            };

            dispatch(setAccount('data', [updatedRow]));
            dispatch(setAccount('error', null));
            return { ok: true, data: updatedRow };
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setAccount('error', msg));
            dispatch(setUbereduxKey({ key: 'error', value: msg }));
            return { ok: false, message: msg };
        }
    };
