'use client';
import * as React from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import { Editable } from '../../../../Leida';
import AvatarUpload from '../../UI/AvatarUpload';

type T_AccountEditor = {
	accountId: string;
	avatarSource?: string;
	displayName: string;
	clinic: string;
	isBusy?: boolean;
	formError?: string | null;
	onAvatarSuccess?: (avatarUrl: string) => void;
	onDisplayNameChange?: (value: string) => void;
	onClinicChange?: (value: string) => void;
	readOnly?: boolean;
};

export default function AccountEditor({
	accountId,
	avatarSource,
	displayName,
	clinic,
	isBusy = false,
	formError,
	onAvatarSuccess,
	onDisplayNameChange,
	onClinicChange,
	readOnly = false,
}: T_AccountEditor) {
	const isDisabled = isBusy || readOnly;
	const handleAvatarSuccess = onAvatarSuccess ?? (() => undefined);
	const handleDisplayNameChange = onDisplayNameChange ?? (() => undefined);
	const handleClinicChange = onClinicChange ?? (() => undefined);

	return (
		<>
			<Grid container spacing={2} sx={{ mb: 2 }}>
				<Grid
					size={{
						xs: 12,
						sm: 6,
					}}
					sx={{
						display: 'flex',
						pt: 2,
						flexDirection: 'column',
						gap: 2,
						justifyContent: 'center',
						alignItems: 'center',
						order: { xs: 1, sm: 2 },
					}}
				>
					<AvatarUpload
						size={200}
						practitionerId={accountId}
						currentAvatar={avatarSource}
						displayName={displayName}
						onSuccess={handleAvatarSuccess}
						disabled={isDisabled}
					/>
				</Grid>
				<Grid
					size={{
						xs: 12,
						sm: 6,
					}}
					sx={{ display: 'flex', flexDirection: 'column', gap: 2, order: { xs: 2, sm: 1 } }}
				>
					<Editable
						id="displayName"
						label="Name"
						variant="standard"
						startAdornment="user"
						value={displayName}
						disabled={isDisabled}
						onChange={handleDisplayNameChange}
					/>
					<Editable
						id="clinic"
						label="Clinic"
						variant="standard"
						startAdornment="medical"
						value={clinic}
						disabled={isDisabled}
						onChange={handleClinicChange}
					/>
				</Grid>
			</Grid>

			<Stack spacing={1.5} sx={{ mb: 2 }}>
				{formError ? (
					<Typography variant="body2" color="error">
						{formError}
					</Typography>
				) : null}
			</Stack>
		</>
	);
}