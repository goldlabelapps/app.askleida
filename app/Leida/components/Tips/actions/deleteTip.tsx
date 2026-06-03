import type { T_RootState, T_UbereduxDispatch } from '../../../../NX/Uberedux/store';
import { setUbereduxKey } from '../../../../NX/Uberedux';

export const deleteTip = (tipId: string): any =>
        async (dispatch: T_UbereduxDispatch, getState: () => T_RootState) => {
            try {
                if (!tipId.trim()) {
                    throw new Error('Missing tip id');
                }

                const response = await fetch('/api/tips', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({ tip_id: tipId }),
                });

                const payload = await response.json().catch(() => null);
                if (!response.ok) {
                    throw new Error(payload?.message || `Failed to delete tip (${response.status})`);
                }

                const state = getState();
                const tipsSlice = state?.redux?.tips || {};
                const list = Array.isArray(tipsSlice.list) ? tipsSlice.list : [];
                const updatedList = list.filter((tip: any) => {
                    const candidateId =
                        typeof tip?.tip_id === 'string'
                            ? tip.tip_id
                            : typeof tip?.id === 'string'
                                ? tip.id
                                : null;
                    return candidateId !== tipId;
                });

                dispatch(
                    setUbereduxKey({
                        key: 'tips',
                        value: {
                            ...tipsSlice,
                            list: updatedList,
                            error: null,
                        },
                    }),
                );
            } catch (e: unknown) {
                const msg = e instanceof Error ? e.message : String(e);
                dispatch(setUbereduxKey({ key: 'error', value: msg }));
            }
        };

        