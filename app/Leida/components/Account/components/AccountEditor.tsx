'use client';
import * as React from 'react';
import { Box, Grid, Stack, Typography, ListItemButton, IconButton,

	ListItemText,
	ListItemIcon,
 } from '@mui/material';
import { Icon } from '../../../../NX/DesignSystem';
import type { T_AccountEditor } from '../../../types';
import { Editable } from '../../../../Leida';
import AvatarUpload from '../../UI/AvatarUpload';

type EditField = 'displayName' | 'clinic' | 'website' | null;

interface EditableFieldProps {
	id: string;
	label: string;
	icon: string;
	value: string;
	isEditing: boolean;
	draftValue: string;
	onEdit: () => void;
	onDraftChange: (value: string) => void;
	onSave: () => void;
	onCancel: () => void;
	disabled: boolean;
}

function EditableField({
	id,
	label,
	icon,
	value,
	isEditing,
	draftValue,
	onEdit,
	onDraftChange,
	onSave,
	onCancel,
	disabled,
}: EditableFieldProps) {
	if (isEditing) {
		return (
			<Stack direction="row" spacing={1} alignItems="center">
				<Box sx={{ flex: 1 }}>
					<Editable
						id={id}
						// label={label}
						variant="outlined"
						startAdornment={icon as any}
						value={draftValue}
						disabled={disabled}
						onChange={onDraftChange}
						autoFocus
					/>
				</Box>
				<IconButton size="small" onClick={onSave} disabled={disabled}>
					<Icon icon="tick" />
				</IconButton>
				<IconButton size="small" onClick={onCancel} disabled={disabled}>
					<Icon icon="close" />
				</IconButton>
			</Stack>
		);
	}

	return (
		<ListItemButton
			onClick={onEdit}
			disabled={disabled}
			
		>
			<ListItemIcon>
				<Icon icon={icon as any} />
			</ListItemIcon>
			<ListItemText
				primary={value || '—'}
			/>
		</ListItemButton>
	);
}

export default function AccountEditor({
	accountId,
	avatarSource,
	displayName,
	clinic,
	website,
	isBusy = false,
	formError,
	onAvatarSuccess,
	onDisplayNameChange,
	onClinicChange,
	onWebsiteChange,
	readOnly = false,
}: T_AccountEditor) {
	const isDisabled = isBusy || readOnly;
	const handleAvatarSuccess = onAvatarSuccess ?? (() => undefined);
	const handleDisplayNameChange = onDisplayNameChange ?? (() => undefined);
	const handleClinicChange = onClinicChange ?? (() => undefined);
	const handleWebsiteChange = onWebsiteChange ?? (() => undefined);
	const normalizedWebsite = website ?? '';

	const [editingField, setEditingField] = React.useState<EditField>(null);
	const [draftDisplayName, setDraftDisplayName] = React.useState(displayName);
	const [draftClinic, setDraftClinic] = React.useState(clinic);
	const [draftWebsite, setDraftWebsite] = React.useState(normalizedWebsite);

	React.useEffect(() => {
		setDraftDisplayName(displayName);
		setDraftClinic(clinic);
		setDraftWebsite(normalizedWebsite);
	}, [displayName, clinic, normalizedWebsite]);

	const handleSave = (field: EditField) => {
		if (field === 'displayName') {
			handleDisplayNameChange(draftDisplayName);
		} else if (field === 'clinic') {
			handleClinicChange(draftClinic);
		} else if (field === 'website') {
			handleWebsiteChange(draftWebsite);
		}
		setEditingField(null);
	};

	const handleCancel = (field: EditField) => {
		if (field === 'displayName') {
			setDraftDisplayName(displayName);
		} else if (field === 'clinic') {
			setDraftClinic(clinic);
		} else if (field === 'website') {
			setDraftWebsite(normalizedWebsite);
		}
		setEditingField(null);
	};

	return (
		<>
			<Grid container spacing={2}>

				<Grid
					size={{
						xs: 12,
					}}
					// sx={{
					// 	display: 'flex',
					// 	pt: 2,
					// 	flexDirection: 'column',
					// 	gap: 2,
					// 	justifyContent: 'center',
					// 	alignItems: 'center',
					// }}
				>
					<Box sx={{m:2}}>

						<Typography variant="overline" sx={{ m: 2 }}>
							Account
						</Typography>
						<Box sx={{ height: 16 }} />
						<AvatarUpload
							size={200}
							practitionerId={accountId}
							currentAvatar={avatarSource}
							displayName={displayName}
							onSuccess={handleAvatarSuccess}
							disabled={isDisabled}
						/>
					</Box>
				</Grid>
				
				<Grid
					size={{
						xs: 12,
					}}
				>
					
					<EditableField
						id="displayName"
						label="Name"
						icon="user"
						value={displayName}
						isEditing={editingField === 'displayName'}
						draftValue={draftDisplayName}
						onEdit={() => setEditingField('displayName')}
						onDraftChange={setDraftDisplayName}
						onSave={() => handleSave('displayName')}
						onCancel={() => handleCancel('displayName')}
						disabled={isDisabled}
					/>
					<EditableField
						id="clinic"
						label="Clinic"
						icon="medical"
						value={clinic}
						isEditing={editingField === 'clinic'}
						draftValue={draftClinic}
						onEdit={() => setEditingField('clinic')}
						onDraftChange={setDraftClinic}
						onSave={() => handleSave('clinic')}
						onCancel={() => handleCancel('clinic')}
						disabled={isDisabled}
					/>
					<EditableField
						id="website"
						label="Website"
						icon="link"
						value={normalizedWebsite}
						isEditing={editingField === 'website'}
						draftValue={draftWebsite}
						onEdit={() => setEditingField('website')}
						onDraftChange={setDraftWebsite}
						onSave={() => handleSave('website')}
						onCancel={() => handleCancel('website')}
						disabled={isDisabled}
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