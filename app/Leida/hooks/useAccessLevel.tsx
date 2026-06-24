"use client";

import React from 'react';
import type { User } from '@supabase/supabase-js';

type AccessLevelSource =
    | 'practitioner'
    | 'authMetadata'
    | 'currentClient'
    | 'clientRecord'
    | 'none';

type UseAccessLevelOptions = {
    user: User | null;
    accountState?: unknown;
    livingRoutineState?: unknown;
};

type UseAccessLevelResult = {
    accessLevel: number;
    source: AccessLevelSource;
    practitionerId: string;
    authenticatedClientId: string;
    isResolving: boolean;
    clientLookupError: string | null;
};

const toObject = (value: unknown): Record<string, unknown> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    return value as Record<string, unknown>;
};

const toNumericAccessLevel = (value: unknown) => {
    const normalizedValue = typeof value === 'string' ? value.trim() : value;
    const parsedValue = Number(normalizedValue);
    return Number.isFinite(parsedValue) ? parsedValue : null;
};

const pickString = (value: unknown) => {
    if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed || '';
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
        return String(value);
    }

    return '';
};

const pickAccessLevelFromRecord = (record: Record<string, unknown>) => {
    const data = toObject(record.data);

    return (
        toNumericAccessLevel(record.access_level) ??
        toNumericAccessLevel(record.accessLevel) ??
        toNumericAccessLevel(data.access_level) ??
        toNumericAccessLevel(data.accessLevel)
    );
};

export function useAccessLevel({
    user,
    accountState,
    livingRoutineState,
}: UseAccessLevelOptions): UseAccessLevelResult {
    const [clientRecordAccessLevel, setClientRecordAccessLevel] = React.useState<number | null>(null);
    const [clientLookupError, setClientLookupError] = React.useState<string | null>(null);

    const accountObject = toObject(accountState);
    const accountData = accountObject.data;
    const accountRows = Array.isArray(accountData)
        ? (accountData as unknown[])
        : accountData
            ? [accountData]
            : [];
    const practitionerRow = toObject(accountRows[0]);
    const isAccountLoading = Boolean(accountObject.loading);
    const isAccountInitted = Boolean(accountObject.initted);

    const practitionerId = pickString(practitionerRow.practitioner_id);
    const practitionerAccessLevel = pickAccessLevelFromRecord(practitionerRow);
    const resolvedPractitionerAccessLevel = practitionerAccessLevel ?? (practitionerId ? 3 : null);

    const userMetadata = toObject(user?.user_metadata);
    const appMetadata = toObject(user?.app_metadata);
    const metadataAccessLevel =
        toNumericAccessLevel(userMetadata.access_level) ??
        toNumericAccessLevel(userMetadata.accessLevel) ??
        toNumericAccessLevel(appMetadata.access_level) ??
        toNumericAccessLevel(appMetadata.accessLevel);

    const routineObject = toObject(livingRoutineState);
    const currentClient = toObject(routineObject.currentClient);
    const currentClientAccessLevel = pickAccessLevelFromRecord(currentClient);

    const metadataClientId = pickString(userMetadata.client_id);
    const stateClientId = pickString(currentClient.client_id);
    const authenticatedClientId = metadataClientId || stateClientId;

    const hasResolvedAccessLevel =
        resolvedPractitionerAccessLevel !== null ||
        metadataAccessLevel !== null ||
        currentClientAccessLevel !== null ||
        clientRecordAccessLevel !== null;

    const shouldFetchClientRecord =
        Boolean(user) &&
        Boolean(authenticatedClientId) &&
        isAccountInitted &&
        !isAccountLoading &&
        resolvedPractitionerAccessLevel === null &&
        metadataAccessLevel === null &&
        currentClientAccessLevel === null;
    const isFetchingClient =
        shouldFetchClientRecord &&
        clientRecordAccessLevel === null &&
        clientLookupError === null;

    React.useEffect(() => {
        if (!shouldFetchClientRecord) {
            return;
        }

        let cancelled = false;
        const controller = new AbortController();

        const loadClientAccessLevel = async () => {
            try {
                setClientLookupError(null);

                const response = await fetch(`/api/clients?client_id=${encodeURIComponent(authenticatedClientId)}`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    },
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch client access (${response.status})`);
                }

                const payload = await response.json();
                const payloadData = payload?.data;
                const clientRecord = Array.isArray(payloadData)
                    ? toObject(payloadData[0])
                    : toObject(payloadData);

                if (!clientRecord.client_id || typeof clientRecord.client_id !== 'string') {
                    throw new Error(`No client found for client_id ${authenticatedClientId}`);
                }

                const resolvedAccessLevel = pickAccessLevelFromRecord(clientRecord);

                if (!cancelled) {
                    setClientRecordAccessLevel(resolvedAccessLevel);
                }
            } catch (e: unknown) {
                if (controller.signal.aborted || cancelled) {
                    return;
                }

                const message = e instanceof Error ? e.message : String(e);
                setClientLookupError(message);
            }
        };

        loadClientAccessLevel();

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [authenticatedClientId, shouldFetchClientRecord]);

    if (resolvedPractitionerAccessLevel !== null) {
        return {
            accessLevel: resolvedPractitionerAccessLevel,
            source: 'practitioner',
            practitionerId,
            authenticatedClientId,
            isResolving: false,
            clientLookupError,
        };
    }

    if (metadataAccessLevel !== null) {
        return {
            accessLevel: metadataAccessLevel,
            source: 'authMetadata',
            practitionerId,
            authenticatedClientId,
            isResolving: false,
            clientLookupError,
        };
    }

    if (currentClientAccessLevel !== null) {
        return {
            accessLevel: currentClientAccessLevel,
            source: 'currentClient',
            practitionerId,
            authenticatedClientId,
            isResolving: false,
            clientLookupError,
        };
    }

    if (clientRecordAccessLevel !== null) {
        return {
            accessLevel: clientRecordAccessLevel,
            source: 'clientRecord',
            practitionerId,
            authenticatedClientId,
            isResolving: false,
            clientLookupError,
        };
    }

    return {
        accessLevel: 0,
        source: 'none',
        practitionerId,
        authenticatedClientId,
        isResolving: (!isAccountInitted || isAccountLoading || isFetchingClient) && !hasResolvedAccessLevel,
        clientLookupError,
    };
}