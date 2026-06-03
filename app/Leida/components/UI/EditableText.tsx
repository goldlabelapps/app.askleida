import * as React from 'react';
import { TextField } from '@mui/material';

export type EditableTextProps = {
	value?: string;
	onChange?: (value: string) => void;
	label?: string;
	placeholder?: string;
	disabled?: boolean;
	multiline?: boolean;
	minRows?: number;
};

export default function EditableText({
	value = '',
	onChange,
	label,
	placeholder,
	disabled = false,
	multiline = false,
	minRows,
}: EditableTextProps) {
	return (
		<TextField
			fullWidth
			variant="filled"
			label={label}
			placeholder={placeholder}
			value={value}
			disabled={disabled}
			multiline={multiline}
			minRows={minRows}
			onChange={(event) => onChange?.(event.target.value)}
		/>
	);
}
