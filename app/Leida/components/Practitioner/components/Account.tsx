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
	IconButton,
	Stack,
	Typography,
	useMediaQuery,
} from '@mui/material';
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
	const { user } = useSupabaseAuth();
    const title = practitioner?.title || 'Practitioner';
	const profile = getPractitionerProfile(practitioner?.data ?? null);
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
					<Avatar src={avatarSource} sx={{ width: 56, height: 56 }}>
						{!avatarSource ? <Icon icon="clients" color="primary" /> : null}
					</Avatar>
					<Box>
						<Typography variant="h5">
                            {name}
                        </Typography>
						<Typography variant="body2" color="text.secondary">
                            {email}
						</Typography>
					</Box>
				</Stack>
			<Box
				sx={{
					position: 'absolute',
					right: 16,
					top: 16,
					display: 'flex',
					alignItems: 'center',
					gap: 1,
				}}
			>
                <IconButton 
                    color="primary"
                    onClick={handleRequestSignout} 
                    aria-label="sign out">
                    <Icon icon="signout" />
                </IconButton>
				<IconButton
                    color="primary"
					onClick={handleClose}
					aria-label="close account dialog"
				>
					<Icon icon="close" />
				</IconButton>
				
			</Box>
                
			</DialogTitle>

			<DialogContent>
                <Box>
                    <pre>
                        {JSON.stringify(practitioner?.data?.data, null, 2)}
                    </pre>
                </Box>
			</DialogContent>

			<DialogActions sx={{ px: 2, py: 2 }}>
				<Button
                    fullWidth
					color="primary"
					variant="outlined"
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
