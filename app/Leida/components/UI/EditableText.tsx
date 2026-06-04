import * as React from 'react';
import { TextField } from '@mui/material';

export type EditableTextProps = {
	value?: string;
	onChange?: (value: string) => void;
	label?: string;
	placeholder?: string;
	disabled?: boolean;
	autoFocus?: boolean;
	multiline?: boolean;
	minRows?: number;
    variant?: 'standard' | 'outlined' | 'filled';
};

export default function EditableText({
	value = '',
	onChange,
	label,
	placeholder,
	disabled = false,
	autoFocus = false,
	multiline = false,
	minRows,
    variant = 'outlined',
}: EditableTextProps) {
	const isEmpty = value.trim().length === 0;

	return (
		<TextField
			sx={{
				'& .MuiInputBase-root': {
					backgroundColor: isEmpty ? 
						'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.75)',
				},
			}}
			fullWidth
			variant={variant}
			label={label}
			placeholder={placeholder}
			value={value}
			disabled={disabled}
			autoFocus={autoFocus}
			multiline={multiline}
			minRows={minRows}
			onChange={(event) => onChange?.(event.target.value)}
		/>
	);
}
