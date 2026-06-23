'use client';
import * as React from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import type { T_AccountEditor } from '../../../../types';
import { Editable } from '../../../../Leida';
import AvatarUpload from '../../UI/AvatarUpload';

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
                    <Box sx={{ height: 16 }}/>
					<Editable
						id="displayName"
						label="Name"
						variant="outlined"
						startAdornment="user"
						value={displayName}
						disabled={isDisabled}
						onChange={handleDisplayNameChange}
					/>
					<Editable
						id="clinic"
						label="Clinic"
						variant="outlined"
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