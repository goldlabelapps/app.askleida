import type { T_RootState, T_UbereduxDispatch } from '../../../../NX/Uberedux/store';
import { initClients } from '../../../../Leida';
import { initAccount, patchAccount } from '../../Account';
import { setOnboarding } from './setOnboarding';

type T_OnboardingStatus = {
    setPassword: boolean;
    createFirstClient: boolean;
};

const toObject = (value: unknown): Record<string, unknown> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    return value as Record<string, unknown>;
};

const toBoolean = (value: unknown): boolean => {
    return value === true;
};

const onboardingEquals = (a: T_OnboardingStatus, b: T_OnboardingStatus): boolean => {
    return (
        a.setPassword === b.setPassword
        && a.createFirstClient === b.createFirstClient
    );
};

export const initOnboarding = (practitionerId?: string): any =>
    async (dispatch: T_UbereduxDispatch, getState: () => T_RootState) => {
        try {
            dispatch(setOnboarding('loading', true));
            dispatch(setOnboarding('error', null));

            const initialState = getState();
            const practitionerSlice = initialState?.redux?.practitioner || {};
            const shouldInitPractitioner = (
                !practitionerSlice?.initted
                && !practitionerSlice?.loading
                && typeof practitionerId === 'string'
                && practitionerId.trim().length > 0
            );

            if (shouldInitPractitioner) {
                await dispatch(initAccount(practitionerId));
            }

            const stateAfterPractitioner = getState();
            const shouldInitClients = (
                !stateAfterPractitioner?.redux?.clients?.initted
                && !stateAfterPractitioner?.redux?.clients?.loading
                && typeof practitionerId === 'string'
                && practitionerId.trim().length > 0
            );
            if (shouldInitClients) {
                await dispatch(initClients(practitionerId));
            }

            const state = getState();
            const practitionerRows = Array.isArray(state?.redux?.practitioner?.data)
                ? state.redux.practitioner.data
                : [];
            const practitionerRow = practitionerRows[0] && typeof practitionerRows[0] === 'object'
                ? (practitionerRows[0] as Record<string, unknown>)
                : null;
            const practitionerData = toObject(practitionerRow?.data);
            const currentOnboardingValue = practitionerData.onboarding;
            const currentOnboarding = toObject(currentOnboardingValue);
            const hasOnboardingKey = (
                currentOnboardingValue
                && typeof currentOnboardingValue === 'object'
                && !Array.isArray(currentOnboardingValue)
            );

            const clients = Array.isArray(state?.redux?.clients?.list) ? state.redux.clients.list : [];

            const nextOnboarding: T_OnboardingStatus = {
                setPassword: true,
                createFirstClient: toBoolean(currentOnboarding.createFirstClient) || clients.length > 0,
            };

            const nextCompleted = (
                nextOnboarding.setPassword
                && nextOnboarding.createFirstClient
            );

            const currentSerialized: T_OnboardingStatus = {
                setPassword: toBoolean(currentOnboarding.setPassword),
                createFirstClient: toBoolean(currentOnboarding.createFirstClient),
            };
            const shouldPersist = !hasOnboardingKey || !onboardingEquals(currentSerialized, nextOnboarding);

            const nextPractitionerId = typeof practitionerRow?.practitioner_id === 'string'
                ? practitionerRow.practitioner_id.trim()
                : '';

            if (shouldPersist && nextPractitionerId) {
                await dispatch(
                    patchAccount(nextPractitionerId, {
                        data: {
                            onboarding: nextOnboarding,
                        },
                    }),
                );
            }

            dispatch(setOnboarding('data', nextOnboarding));
            dispatch(setOnboarding('open', !nextCompleted));
            dispatch(setOnboarding('completed', nextCompleted));
            dispatch(setOnboarding('brandNew', !hasOnboardingKey));
            dispatch(setOnboarding('initted', true));
            dispatch(setOnboarding('loading', false));
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setOnboarding('error', msg));
            dispatch(setOnboarding('initted', true));
            dispatch(setOnboarding('loading', false));
        }
    };
