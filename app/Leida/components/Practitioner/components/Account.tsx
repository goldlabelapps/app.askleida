'use client';
import * as React from 'react';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
	Typography,
	useMediaQuery,
	LinearProgress,
} from '@mui/material';
import AvatarUpload from '../../UI/AvatarUpload';
import { useTheme } from '@mui/material/styles';
import { ConfirmAction, Icon } from '../../../../NX/DesignSystem';
import { Editable } from '../../../../Leida';
import { setPaywall, useSupabaseAuth } from '../../../../NX/Paywall';
import { useDispatch } from '../../../../NX/Uberedux';
import { setPractitioner } from '..';
import { usePractitioner } from '../hooks/usePractitioner';
import { supabase } from '../../../../NX/lib/supabase';

function getPractitionerProfile(value: unknown): Record<string, unknown> | null {
	if (!value || typeof value !== 'object') {
		return null;
	}

	const record = value as Record<string, unknown>;
	if (record.data && typeof record.data === 'object') {
		return record.data as Record<string, unknown>;
	}

	return record;
}

export default function Account() {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const dispatch = useDispatch();
	const practitioner = usePractitioner();
	const practitionerRows = Array.isArray(practitioner?.data) ? practitioner.data : [];
	const { user } = useSupabaseAuth();
	const profile = getPractitionerProfile(practitionerRows[0] ?? null);
	const open = Boolean(practitioner?.accountOpen);
	const name = String(
		profile?.display_name || profile?.title || user?.user_metadata?.full_name || 'Your account',
	);
	const email = String(profile?.email || user?.email || 'No email available');
	const [confirmSignoutOpen, setConfirmSignoutOpen] = React.useState(false);
	const [displayNameError, setDisplayNameError] = React.useState<string | null>(null);
	const [displayNameDraft, setDisplayNameDraft] = React.useState(name);
	const [isSavingDisplayName, setIsSavingDisplayName] = React.useState(false);
	const [isSigningOut, setIsSigningOut] = React.useState(false);
	const avatarSource =
		typeof profile?.avatar === 'string' && profile.avatar.trim()
			? profile.avatar.trim()
			: undefined;
	const practitionerId = String(practitionerRows[0]?.practitioner_id ?? '');
	const isLoadingPractitioner = Boolean(practitioner?.loading);
	const isBusy = isLoadingPractitioner || isSavingDisplayName || isSigningOut;
	const normalizedDraftDisplayName = displayNameDraft.trim();
	const normalizedCurrentDisplayName = name.trim();
	const canSaveDisplayName =
		!isBusy &&
		normalizedDraftDisplayName.length > 0 &&
		normalizedDraftDisplayName !== normalizedCurrentDisplayName;

	React.useEffect(() => {
		setDisplayNameDraft(name);
	}, [name]);

	const handleAvatarSuccess = (avatarUrl: string) => {
		const current = practitionerRows[0] ?? {};
		const currentData = (current.data && typeof current.data === 'object')
			? current.data as Record<string, unknown>
			: {};
		const updated = {
			...current,
			data: { ...currentData, avatar: avatarUrl },
		};
		dispatch(setPractitioner('data', [updated]));
	};

	const handleClose = () => {
		if (isBusy) return;
		dispatch(setPractitioner('accountOpen', false));
	};

	const handleDisplayNameSave = async (newDisplayName: string) => {
		if (!practitionerId) {
			setDisplayNameError('Unable to update your name: missing practitioner id.');
			return;
		}

		const normalizedName = newDisplayName.trim();
		if (!normalizedName) {
			setDisplayNameError('Display name cannot be empty.');
			return;
		}

		setDisplayNameError(null);
		setIsSavingDisplayName(true);

		const current = practitionerRows[0] ?? {};
		const currentData = (current.data && typeof current.data === 'object')
			? current.data as Record<string, unknown>
			: {};
		const nextData = { ...currentData, display_name: normalizedName };

		try {
			const response = await fetch('/api/practitioner', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					practitioner_id: practitionerId,
					data: nextData,
				}),
			});

			const payload = await response.json().catch(() => null);
			if (!response.ok) {
				setDisplayNameError(
					typeof payload?.message === 'string'
						? payload.message
						: 'Failed to update display name.'
				);
				return;
			}

			const returnedRows = Array.isArray(payload?.data) ? payload.data : null;
			const returnedRow = returnedRows && returnedRows.length > 0 ? returnedRows[0] : null;
			const updatedRow = returnedRow
				? returnedRow
				: {
					...current,
					data: nextData,
				};

			dispatch(setPractitioner('data', [updatedRow]));
		} finally {
			setIsSavingDisplayName(false);
		}
	};

	const handleRequestSignout = () => {
		if (isBusy) return;
		setConfirmSignoutOpen(true);
	};

	const handleCancelSignout = () => {
		if (isBusy) return;
		setConfirmSignoutOpen(false);
	};

	const handleConfirmSignout = async () => {
		setIsSigningOut(true);
		setConfirmSignoutOpen(false);
		try {
			await supabase.auth.signOut();
			dispatch(setPaywall('supabaseAuth', null));
			dispatch(setPractitioner('accountOpen', false));
		} finally {
			setIsSigningOut(false);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={(_, reason) => {
				if (isBusy) return;
				if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
					handleClose();
				}
			}}
			fullScreen={fullScreen}
			fullWidth
			maxWidth="md"
			PaperProps={{
				sx: (currentTheme) => ({
					width: '100%',
					minHeight: fullScreen ? '100%' : '70vh',
					'@media (min-width:900px)': {
						minWidth: `${currentTheme.breakpoints.values.md}px`,
					},
				}),
			}}
		>
			<DialogTitle sx={{ pr: 14 }}>
				<Typography variant="body2" color="disabled">
					{email}
				</Typography>
				{isBusy ? <LinearProgress /> : null}    
			</DialogTitle>

			<DialogContent>
				<Stack spacing={1.5} sx={{ mb: 2 }}>
					

					<Box>
						<AvatarUpload
							practitionerId={practitionerId}
							currentAvatar={avatarSource}
							displayName={name}
							onSuccess={handleAvatarSuccess}
							disabled={isBusy}
						/>
					</Box>



					<Typography variant="body2" color="text.secondary">
						Display name
					</Typography>
					<Editable
						label="Display name"
						value={displayNameDraft}
						disabled={isBusy}
						onChange={(nextValue) => {
							setDisplayNameError(null);
							setDisplayNameDraft(nextValue);
						}}
					/>
					<Button
						color="primary"
						variant="contained"
						disabled={!canSaveDisplayName}
						onClick={() => {
							void handleDisplayNameSave(displayNameDraft);
						}}
					>
						Save name
					</Button>
					{displayNameError ? (
						<Typography variant="body2" color="error">
							{displayNameError}
						</Typography>
					) : null}

				</Stack>

				{/* <Box>
                    <pre>
	                    {JSON.stringify(practitionerRows[0]?.data, null, 2)}
                    </pre>
                </Box> */}


				


			</DialogContent>

			<DialogActions sx={{ px: 2, py: 2 }}>

				<Button
					color="primary"
					variant="text"
					onClick={handleRequestSignout}
					startIcon={<Icon icon="signout" />}
					disabled={isBusy}
				>
					Sign out
				</Button>

				<Button
					color="primary"
					variant="outlined"
					onClick={handleClose}
					startIcon={<Icon icon="close" />}
					disabled={isBusy}
				>
					Close
				</Button>
			</DialogActions>

			<ConfirmAction
				open={confirmSignoutOpen}
				icon="signout"
				title="Sign out?"
				body={`You are signed in as ${email}. Do you want to sign out now?`}
				handleConfirm={handleConfirmSignout}
				handleClose={handleCancelSignout}
			/>
		</Dialog>
	);
}
