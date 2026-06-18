'use client';
import * as React from 'react';
import {
	Box,
	Grid,
	Button,
	Collapse,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	LinearProgress,
	Stack,
	Typography,
	useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ConfirmAction, Icon } from '../../../../NX/DesignSystem';
import { setPaywall, useSupabaseAuth } from '../../../../NX/Paywall';
import { useDispatch } from '../../../../NX/Uberedux';
import { Editable } from '../../../../Leida';
import { supabase } from '../../../../NX/lib/supabase';
import { patchAccount, setAccount } from '..';
import AvatarUpload from '../../UI/AvatarUpload';
import { useAccount } from '../hooks/useAccount';

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

function getTextValue(value: unknown, fallback = ''): string {
	if (typeof value !== 'string') {
		return fallback;
	}

	return value;
}

export default function Account() {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const dispatch = useDispatch();
	const account = useAccount();
	const accountRows = Array.isArray(account?.data) ? account.data : [];
	const { user } = useSupabaseAuth();
	const profile = getAccountProfile(accountRows[0] ?? null);
	const open = Boolean(account?.accountOpen);
	const hasDisplayName = Boolean(profile?.display_name);
	const isOnboarding = account?.initted === true && !hasDisplayName;
	const name = String(
		profile?.display_name || profile?.title || user?.user_metadata?.full_name || 'Your account',
	);
	const clinic = getTextValue(profile?.clinic, '');
	const website = getTextValue(profile?.website, '');
	const email = String(profile?.email || user?.email || 'No email available');
	const [confirmSignoutOpen, setConfirmSignoutOpen] = React.useState(false);
	const [formError, setFormError] = React.useState<string | null>(null);
	const [isSavingForm, setIsSavingForm] = React.useState(false);
	const [isSigningOut, setIsSigningOut] = React.useState(false);

	const [formState, setFormState] = React.useState({
		email,
		displayName: name,
		clinic,
		website,
	});

	const avatarSource =
		typeof profile?.avatar === 'string' && profile.avatar.trim()
			? profile.avatar.trim()
			: undefined;
	const initialAvatarWhenOpenedRef = React.useRef<string>(avatarSource ?? '');
	const accountId = String(accountRows[0]?.practitioner_id ?? '');
	const isLoadingAccount = Boolean(account?.loading);
	const isBusy = isLoadingAccount || isSavingForm || isSigningOut;

	const normalizedDraftDisplayName = formState.displayName.trim();
	const normalizedCurrentDisplayName = name.trim();
	const normalizedDraftClinic = formState.clinic.trim();
	const normalizedCurrentClinic = clinic.trim();
	const normalizedDraftWebsite = formState.website.trim();
	const normalizedCurrentWebsite = website.trim();
	const normalizedCurrentAvatar = (avatarSource ?? '').trim();
	const normalizedInitialAvatar = initialAvatarWhenOpenedRef.current.trim();
	const isAvatarDirty = normalizedCurrentAvatar !== normalizedInitialAvatar;
	const isFormDirty =
		normalizedDraftDisplayName !== normalizedCurrentDisplayName ||
		normalizedDraftClinic !== normalizedCurrentClinic ||
		normalizedDraftWebsite !== normalizedCurrentWebsite ||
		isAvatarDirty;
	const canSaveForm = !isBusy && normalizedDraftDisplayName.length > 0 && isFormDirty;

	React.useEffect(() => {
		setFormState({
			email,
			displayName: name,
			clinic,
			website,
		});
	}, [email, name, clinic, website]);

	React.useEffect(() => {
		if (isOnboarding && !open) {
			dispatch(setAccount('accountOpen', true));
		}
	}, [isOnboarding, open, dispatch]);

	React.useEffect(() => {
		if (open) {
			initialAvatarWhenOpenedRef.current = avatarSource ?? '';
		}
	}, [open]);

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

	const handleClose = () => {
		if (isBusy || isOnboarding) return;
		dispatch(setAccount('accountOpen', false));
	};

	const handleFormSave = async () => {
		if (!accountId) {
			setFormError('Unable to update your account: missing practitioner id.');
			return;
		}

		const normalizedName = formState.displayName.trim();
		if (!normalizedName) {
			setFormError('Display name cannot be empty.');
			return;
		}

		setFormError(null);
		setIsSavingForm(true);

		try {
			const result = await dispatch(
				patchAccount(accountId, {
					data: {
						display_name: normalizedName,
					clinic: normalizedDraftClinic || null,
					website: normalizedDraftWebsite || null,
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
			dispatch(setAccount('accountOpen', false));
		} finally {
			setIsSigningOut(false);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={(_, reason) => {
				if (isBusy || isOnboarding) return;
				if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
					handleClose();
				}
			}}
			fullScreen={fullScreen}
			fullWidth
			maxWidth="sm"
			PaperProps={{
				sx: (currentTheme) => ({
					width: '100%',
					minHeight: fullScreen ? '100%' : '70vh',
					
				}),
			}}
		>
			
			{isBusy ? <LinearProgress /> : null}

			<DialogContent>

				<Grid container spacing={2} sx={{ mb: 2 }}>
					<Grid size={{
						xs: 12,
						sm: 6,
					}} sx={{ display: 'flex', 
					pt: 2,
					flexDirection: 'column', 
					gap: 2, 
					justifyContent: 'center', 
					alignItems: 'center', 
					order: { xs: 1, sm: 2 } }}>
						<AvatarUpload
							size={200}
							practitionerId={accountId}
							currentAvatar={avatarSource}
							displayName={name}
							onSuccess={handleAvatarSuccess}
							disabled={isBusy}
						/>
					</Grid>	
					<Grid size={{
						xs: 12,
						sm: 6,
					}} sx={{ display: 'flex', flexDirection: 'column', gap: 2, order: { xs: 2, sm: 1 } }}>
						<Editable
							id="displayName"
							label="Name"
							variant="standard"
							startAdornment='user'
							value={formState.displayName}
							disabled={isBusy}
							onChange={(nextValue) => {
								setFormError(null);
								setFormState((current) => ({
									...current,
									displayName: nextValue,
								}));
							}}
						/>
						<Editable
							id="email"
							label="Clinic"
							variant="standard"
							startAdornment='medical'
							value={formState.clinic}
							disabled={isBusy}
							onChange={(nextValue) => {
								setFormError(null);
								setFormState((current) => ({
									...current,
									clinic: nextValue,
								}));
							}}
						/>

					</Grid>	

					<Grid size={{
						xs: 12,
						sm: 6,
					}} sx={{ display: 'flex', flexDirection: 'column', gap: 2, order: { xs: 2, sm: 1 } }}>
						
					</Grid>

					
				</Grid>

				<Stack spacing={1.5} sx={{ mb: 2 }}>
					{formError ? (
						<Typography variant="body2" color="error">
							{formError}
						</Typography>
					) : null}
				</Stack>
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
					variant="text"
					onClick={handleClose}
					startIcon={<Icon icon="close" />}
					disabled={isBusy || isOnboarding}
				>
					Close
				</Button>

				<Collapse in={isFormDirty} orientation="horizontal" unmountOnExit>
					<Button
						startIcon={<Icon icon="save" />}
						color="primary"
						variant="contained"
						disabled={!canSaveForm}
						onClick={() => {
							void handleFormSave();
							handleClose();
						}}
					>
						Save
					</Button>
				</Collapse>
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
