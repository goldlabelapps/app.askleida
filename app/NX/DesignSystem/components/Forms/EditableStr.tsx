"use client";
import * as React from 'react';
import {
	Box,
	Typography,
	TextField,
	Button,
	Dialog,
	DialogContent,
	DialogActions,
	DialogTitle,
	IconButton,
} from '@mui/material';
import { Icon } from '../../../DesignSystem';

export interface I_EditableStr {
	id: string;
	dialogTitle?: string;
	value?: string;
  onSave?: (newValue: string) => void | Promise<void>;
  disabled?: boolean;
}


export default function EditableStr({ 
	id, 
	value = '', 
	onSave,
  dialogTitle = 'Editing...',
  disabled = false,
}: I_EditableStr) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [editing, setEditing] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);


  // Focus and select text when dialog opens
  React.useEffect(() => {
      setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            const len = inputRef.current.value.length;
            inputRef.current.setSelectionRange(len, len);
          }
      }, 500);
  }, [editing]);

  // Keep inputValue in sync if value prop changes
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleEditClick = () => {
    if (disabled) return;
    setEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSave = async () => {
    if (disabled) return;
    if (onSave) {
      await onSave(inputValue);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setInputValue(value);
    setEditing(false);
  };

  return (
    <>
      <Box id={id} sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }} onClick={handleEditClick} style={{ cursor: 'pointer' }}>
          <Typography variant='h6' sx={{ flex: 1 }}>{value}</Typography>
        </Box>
      </Box>
      <Dialog open={editing} onClose={disabled ? undefined : handleCancel} fullWidth maxWidth="xs">
        <DialogTitle>
        	<Box sx={{ display: 'flex' }}>
        		<Typography variant="h6" component="span" sx={{mt:1}}>
        			{dialogTitle}
        		</Typography>
        		<Box sx={{flexGrow:1}}/>
        		<IconButton
        			sx={{mr:-2}}
        			onClick={handleCancel}
          		disabled={disabled}
        			color="primary"
        		>
        			<Icon icon="close" />
        		</IconButton>
        	</Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            inputRef={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            disabled={disabled}
            fullWidth
            margin="dense"
            onKeyDown={(e) => {
              if (disabled) return;
              if (e.key === 'Enter' && inputValue !== value) {
                void handleSave();
              }
              if (e.key === 'Escape') handleCancel();
            }}
          />
        </DialogContent>
        <DialogActions sx={{px:2}}>
          <Button 
					  sx={{ mr: 1 }}
      	onClick={() => {
        void handleSave();
      }} 
			endIcon={<Icon icon="save" />}
			color="primary" 
			variant="contained" 
      disabled={disabled || inputValue === value}>
            Save
          </Button>
				  
        </DialogActions>

      </Dialog>
    </>
  );
}
