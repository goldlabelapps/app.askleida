import * as React from 'react';
import { Button, Checkbox, FormControlLabel, Popover, TextField } from '@mui/material';
import type { CheckboxProps } from '@mui/material';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Icon } from '../../../NX/DesignSystem';

type EditableBaseProps = {
	label?: string;
	placeholder?: string;
	disabled?: boolean;
	required?: boolean;
	autoFocus?: boolean;
	multiline?: boolean;
	minRows?: number;
    variant?: 'standard' | 'outlined' | 'filled';
	editableType?: 'text' | 'date';
	checkboxProps?: Omit<CheckboxProps, 'checked' | 'onChange' | 'disabled' | 'required'>;
};

type EditableTextProps = EditableBaseProps & {
	value?: string | number;
	onChange?: (value: string) => void;
	checkboxProps?: never;
};

type EditableBooleanProps = EditableBaseProps & {
	value: boolean;
	onChange?: (value: boolean) => void;
	checkboxProps?: Omit<CheckboxProps, 'checked' | 'onChange' | 'disabled' | 'required'>;
};

export type EditableProps = EditableTextProps | EditableBooleanProps;

const toDayjsOrNull = (value: string): Dayjs | null => {
	if (!value.trim()) {
		return null;
	}

	const parsed = dayjs(value);
	if (!parsed.isValid()) {
		return null;
	}

	return parsed;
};

const toHumanDateLabel = (value: string): string => {
	if (!value.trim()) {
		return 'Select date';
	}

	const parsed = dayjs(value);
	if (!parsed.isValid()) {
		return value;
	}

	return parsed.format('D MMMM YYYY');
};

export default function Editable({
	value = '',
	onChange,
	label,
	placeholder,
	disabled = false,
	required = false,
	autoFocus = false,
	multiline = false,
	minRows,
    variant = 'outlined',
    editableType = 'text',
    checkboxProps,
}: EditableProps) {
	const [dateAnchorEl, setDateAnchorEl] = React.useState<HTMLButtonElement | null>(null);

	const handleOpenDatePicker = (event: React.MouseEvent<HTMLButtonElement>) => {
		setDateAnchorEl(event.currentTarget);
	};

	const handleCloseDatePicker = () => {
		setDateAnchorEl(null);
	};

	if (typeof value === 'boolean') {
		const handleBooleanChange = onChange as EditableBooleanProps['onChange'];

		return (
			<FormControlLabel
				label={label || ''}
				control={
					<Checkbox
						checked={value}
						disabled={disabled}
						required={required}
						onChange={(_, checked) => handleBooleanChange?.(checked)}
						{...checkboxProps}
					/>
				}
			/>
		);
	}

	const handleTextChange = onChange as EditableTextProps['onChange'];

	const normalizedValue = typeof value === 'number' ? String(value) : (value || '');

	if (editableType === 'date') {
		const humanDateLabel = toHumanDateLabel(normalizedValue);
		const selectedDate = toDayjsOrNull(normalizedValue);

		return (
			<>
				<Button
					fullWidth
					variant="outlined"
					color="primary"
					startIcon={<Icon icon="date" />}
					disabled={disabled}
					onClick={handleOpenDatePicker}
					aria-label={label || 'Select date'}
				>
					{humanDateLabel}
				</Button>
				<Popover
					open={Boolean(dateAnchorEl)}
					anchorEl={dateAnchorEl}
					onClose={handleCloseDatePicker}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DateCalendar
							value={selectedDate}
							disabled={disabled}
							onChange={(nextDate) => {
								handleTextChange?.(nextDate ? nextDate.format('YYYY-MM-DD') : '');
								if (nextDate || !required) {
									handleCloseDatePicker();
								}
							}}
						/>
					</LocalizationProvider>
				</Popover>
			</>
		);
	}

	const isEmpty = normalizedValue.trim().length === 0;

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
			value={normalizedValue}
			disabled={disabled}
			required={required}
			autoFocus={autoFocus}
			multiline={multiline}
			minRows={minRows}
			onChange={(event) => handleTextChange?.(event.target.value)}
		/>
	);
}
