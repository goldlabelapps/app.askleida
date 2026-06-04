'use client';
import * as React from 'react';
import {
	Avatar,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	Stack,
	Typography,
	useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Icon } from '../../../../NX/DesignSystem';
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
	const { user } = useSupabaseAuth();
	const profile = getPractitionerProfile(practitioner?.data ?? null);
	const open = Boolean(practitioner?.accountOpen);
	const name = String(
		profile?.display_name || profile?.title || user?.user_metadata?.full_name || 'Your account',
	);
	const email = String(profile?.email || user?.email || 'No email available');
	const avatarSource =
		typeof profile?.avatar === 'string' && profile.avatar.trim()
			? profile.avatar.trim()
			: undefined;

	const handleClose = () => {
		dispatch(setPractitioner('accountOpen', false));
	};

	const handleSignout = async () => {
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
			<DialogTitle sx={{ pr: 7 }}>
				<Stack direction="row" spacing={2} alignItems="center">
					<Avatar src={avatarSource} sx={{ width: 56, height: 56 }}>
						{!avatarSource ? <Icon icon="clients" color="primary" /> : null}
					</Avatar>
					<Box>
						<Typography variant="h5">{name}</Typography>
						<Typography variant="body2" color="text.secondary">
							Practitioner account
						</Typography>
					</Box>
				</Stack>

				<IconButton
					onClick={handleClose}
					aria-label="close account dialog"
					sx={{ position: 'absolute', right: 16, top: 16 }}
				>
					<Icon icon="cancel" />
				</IconButton>
			</DialogTitle>

			<DialogContent dividers>
				<Stack spacing={3}>
					<Box>
						<Typography variant="overline" color="text.secondary">
							Personal details
						</Typography>
						<Typography variant="body1">{name}</Typography>
						<Typography variant="body2" color="text.secondary">
							{email}
						</Typography>
					</Box>

					<Divider />

					<Box>
						<Typography variant="overline" color="text.secondary">
							Settings
						</Typography>
						<Typography variant="body2" color="text.secondary">
							This dialog is ready for account controls such as profile updates, preferences,
							and practitioner-specific settings.
						</Typography>
					</Box>

					<Divider />

					<Box>
						<Typography variant="overline" color="text.secondary">
							Status
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{practitioner?.loading
								? 'Loading practitioner details.'
								: practitioner?.error
									? String(practitioner.error)
									: 'Practitioner details loaded.'}
						</Typography>
					</Box>
				</Stack>
			</DialogContent>

			<DialogActions sx={{ px: 3, py: 2 }}>
				<Button
					onClick={handleSignout}
					color="primary"
					variant="contained"
					startIcon={<Icon icon="signout" />}
				>
					Sign out
				</Button>
			</DialogActions>
		</Dialog>
	);
}
