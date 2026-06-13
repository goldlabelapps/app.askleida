'use client';
import * as React from 'react';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	Typography,
	useMediaQuery,
} from '@mui/material';
import AvatarUpload from '../../UI/AvatarUpload';
import { useTheme } from '@mui/material/styles';
import { ConfirmAction, Icon } from '../../../../NX/DesignSystem';
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
	const avatarSource =
		typeof profile?.avatar === 'string' && profile.avatar.trim()
			? profile.avatar.trim()
			: undefined;
	const practitionerId = String(practitionerRows[0]?.practitioner_id ?? '');

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
		dispatch(setPractitioner('accountOpen', false));
	};

	const handleRequestSignout = () => {
		setConfirmSignoutOpen(true);
	};

	const handleCancelSignout = () => {
		setConfirmSignoutOpen(false);
	};

	const handleConfirmSignout = async () => {
		setConfirmSignoutOpen(false);
		handleClose();
		await supabase.auth.signOut();
		dispatch(setPaywall('supabaseAuth', null));
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
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
				<Stack direction="row" spacing={2} alignItems="center">
					<AvatarUpload
						practitionerId={practitionerId}
						currentAvatar={avatarSource}
						displayName={name}
						onSuccess={handleAvatarSuccess}
					/>
					<Box>
						<Typography variant="h5">
                            {name}
                        </Typography>
						<Typography variant="body2" color="text.secondary">
                            {email}
						</Typography>
					</Box>
				</Stack>
			
                
			</DialogTitle>

			<DialogContent>
                <Box>
                    <pre>
	                    {JSON.stringify(practitionerRows[0]?.data, null, 2)}
                    </pre>
                </Box>


				<Button
					color="primary"
					variant="outlined"
					onClick={handleRequestSignout}
					startIcon={<Icon icon="signout" />}
				>
					Sign out
				</Button>


			</DialogContent>

			<DialogActions sx={{ px: 2, py: 2 }}>
				<Button
					color="primary"
					variant="outlined"
					onClick={handleClose}
					startIcon={<Icon icon="close" />}
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
