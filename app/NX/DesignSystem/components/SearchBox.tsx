'use client'; 
import * as React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Icon } from '../../DesignSystem';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onEnter: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  startIcon?: string;
  endIcon?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChange,
  onEnter,
  placeholder = 'Search...',
  disabled = false,
  startIcon = 'search',
  endIcon,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEnter(value);
    }
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      value={value}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      InputProps={{
        startAdornment: startIcon && (
          <InputAdornment position="start">
            <Icon icon={startIcon as any} />
          </InputAdornment>
        ),
        endAdornment: endIcon && (
          <InputAdornment position="end">
            <IconButton size="small" disabled={disabled}>
              <Icon icon={endIcon as any} />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchBox;
