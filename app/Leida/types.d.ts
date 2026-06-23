declare module "*.css";

import type { ComponentProps, ReactNode } from 'react';
import type { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import type { CheckboxProps } from '@mui/material';
import type { Icon } from '../DesignSystem';
import type { T_Config } from '../types';

export type IconName = ComponentProps<typeof Icon>['icon'];

export type EditableBaseProps = {
    id?: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    autoFocus?: boolean;
    multiline?: boolean;
    minRows?: number;
    variant?: 'standard' | 'outlined' | 'filled';
    startAdornment?: IconName;
    endAdornment?: IconName;
    editableType?: 'text' | 'date' | 'select' | 'chips';
    options?: readonly string[];
    checkboxProps?: Omit<CheckboxProps, 'checked' | 'onChange' | 'disabled' | 'required'>;
};

export type EditableTextProps = EditableBaseProps & {
    value?: string | number;
    onChange?: (value: string) => void;
    checkboxProps?: never;
};

export type EditableMultiSelectProps = EditableBaseProps & {
    value: string[];
    onChange?: (value: string[]) => void;
    checkboxProps?: never;
};

export type EditableBooleanProps = EditableBaseProps & {
    value: boolean;
    onChange?: (value: boolean) => void;
    checkboxProps?: Omit<CheckboxProps, 'checked' | 'onChange' | 'disabled' | 'required'>;
};

export type EditableProps = EditableTextProps | EditableBooleanProps | EditableMultiSelectProps;

export type T_ClientData = {
    first_name?: string | null;
    last_name?: string | null;
    date_of_birth?: string | null;
    email?: string | null;
    skin_type?: string | null;
    concern_tags?: string[] | string | null;
    is_pregnant?: boolean | 'true' | 'false' | null;
    is_breastfeeding?: boolean | 'true' | 'false' | null;
    current_medication?: string | null;
    skin_overview?: string | null;
    personal_notes?: string | null;
    [key: string]: unknown;
};

export type T_Client = {
    client_id?: string;
    practitioner_id?: string | null;
    title?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    date_of_birth?: string | null;
    email?: string | null;
    skin_type?: string | null;
    concern_tags?: string[] | string | null;
    is_pregnant?: boolean | 'true' | 'false' | null;
    is_breastfeeding?: boolean | 'true' | 'false' | null;
    current_medication?: string | null;
    skin_overview?: string | null;
    personal_notes?: string | null;
    created?: string | null;
    updated?: string | null;
    created_at?: string | null;
    data?: T_ClientData | null;
    [key: string]: unknown;
};

export type T_AccountEditor = {
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