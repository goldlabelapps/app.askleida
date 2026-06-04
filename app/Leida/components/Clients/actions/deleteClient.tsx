import type { T_RootState, T_UbereduxDispatch } from '../../../../NX/Uberedux/store';
import { setUbereduxKey } from '../../../../NX/Uberedux';
import { setFeedback } from '../../../../NX/DesignSystem';

export const deleteClient = (clientId: string): any =>
    async (dispatch: T_UbereduxDispatch, getState: () => T_RootState) => {
        try {
            if (!clientId.trim()) {
                throw new Error('Missing client id');
            }

            const response = await fetch('/api/clients', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ client_id: clientId }),
            });

            const payload = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(payload?.message || `Failed to delete client (${response.status})`);
            }

            const state = getState();
            const clientsSlice = state?.redux?.clients || {};
            const list = Array.isArray(clientsSlice.list) ? clientsSlice.list : [];
            const updatedList = list.filter((client: any) => {
                const candidateId =
                    typeof client?.client_id === 'string'
                        ? client.client_id
                        : typeof client?.id === 'string'
                            ? client.id
                            : null;
                return candidateId !== clientId;
            });

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

            return true;
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            dispatch(setFeedback({
                title: 'Client Delete Failed',
                description: msg,
                severity: 'error',
            }));
            dispatch(setUbereduxKey({ key: 'error', value: msg }));
            return false;
        }
    };