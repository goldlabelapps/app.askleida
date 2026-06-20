"use client";
import React from 'react';
import { Button, Collapse, Stack } from '@mui/material';
import { Icon } from '../../../NX/DesignSystem';
import { useSupabaseAuth } from '../../../NX/Paywall';
import { useDispatch } from '../../../NX/Uberedux';
import { patchAccount, setAccount, useAccount } from '../Account';
import { AccountDialogContent } from '../../index';
import Wrapper from '../UI/Wrapper';

function getAccountProfile(value: unknown): Record<string, unknown> | null {
    if (!value || typeof value !== 'object') {
        return null;
    }

    const record = value as Record<string, unknown>;
    if (record.data && typeof record.data === 'object') {
        return record.data as Record<string, unknown>;
    }

    return record;
}

const Home: React.FC = () => {
    const dispatch = useDispatch();
    const account = useAccount();
    const { user } = useSupabaseAuth();
    const accountRows = Array.isArray(account?.data) ? account.data : [];
    const profile = getAccountProfile(accountRows[0] ?? null);
    const displayName = String(
        profile?.display_name || profile?.title || user?.user_metadata?.full_name || 'Your account',
    );
    const clinic = typeof profile?.clinic === 'string' ? profile.clinic : '';
    const accountId = String(accountRows[0]?.practitioner_id ?? '');
    const avatarSource =
        typeof profile?.avatar === 'string' && profile.avatar.trim()
            ? profile.avatar.trim()
            : undefined;
    const [formError, setFormError] = React.useState<string | null>(null);
    const [isSavingForm, setIsSavingForm] = React.useState(false);
    const [formState, setFormState] = React.useState({
        displayName,
        clinic,
    });
    const isBusy = Boolean(account?.loading) || isSavingForm;

    const normalizedDraftDisplayName = formState.displayName.trim();
    const normalizedCurrentDisplayName = displayName.trim();
    const normalizedDraftClinic = formState.clinic.trim();
    const normalizedCurrentClinic = clinic.trim();
    const isFormDirty =
        normalizedDraftDisplayName !== normalizedCurrentDisplayName
        || normalizedDraftClinic !== normalizedCurrentClinic;
    const canSaveForm = !isBusy && normalizedDraftDisplayName.length > 0 && isFormDirty;

    React.useEffect(() => {
        setFormState({
            displayName,
            clinic,
        });
    }, [displayName, clinic]);

    const handleAvatarSuccess = (avatarUrl: string) => {
        const current = accountRows[0] ?? {};
        const currentData =
            current.data && typeof current.data === 'object'
                ? (current.data as Record<string, unknown>)
                : {};
        const updated = {
            ...current,
            data: { ...currentData, avatar: avatarUrl },
        };
        dispatch(setAccount('data', [updated]));
    };

    const handleFormSave = async () => {
        if (!accountId) {
            setFormError('Unable to update your account: missing practitioner id.');
            return;
        }

        if (!normalizedDraftDisplayName) {
            setFormError('Display name cannot be empty.');
            return;
        }

        setFormError(null);
        setIsSavingForm(true);

        try {
            const result = await dispatch(
                patchAccount(accountId, {
                    data: {
                        display_name: normalizedDraftDisplayName,
                        clinic: normalizedDraftClinic || null,
                    },
                }),
            );

            if (!result?.ok) {
                setFormError(
                    typeof result?.message === 'string'
                        ? result.message
                        : 'Failed to update account.',
                );
            }
        } finally {
            setIsSavingForm(false);
        }
    };

    return (
        <Wrapper>
            <AccountDialogContent
                accountId={accountId}
                avatarSource={avatarSource}
                displayName={formState.displayName}
                clinic={formState.clinic}
                isBusy={isBusy}
                formError={formError}
                onAvatarSuccess={handleAvatarSuccess}
                onDisplayNameChange={(nextValue) => {
                    setFormError(null);
                    setFormState((current) => ({
                        ...current,
                        displayName: nextValue,
                    }));
                }}
                onClinicChange={(nextValue) => {
                    setFormError(null);
                    setFormState((current) => ({
                        ...current,
                        clinic: nextValue,
                    }));
                }}
            />

            <Stack direction="row" justifyContent="flex-end">
                <Collapse in={isFormDirty} orientation="horizontal" unmountOnExit>
                    <Button
                        startIcon={<Icon icon="save" />}
                        color="primary"
                        variant="contained"
                        disabled={!canSaveForm}
                        onClick={() => {
                            void handleFormSave();
                        }}
                    >
                        Save
                    </Button>
                </Collapse>
            </Stack>
        </Wrapper>
    );
};

export default Home;
