'use client';
import * as React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Icon } from '../../DesignSystem';


type MightyButtonMode = 'auto' | 'button' | 'iconbutton';

interface MightyButtonProps extends React.ComponentProps<typeof Button> {
	icon: string;
	label: string;
	mobileOnly?: boolean;
	mode?: MightyButtonMode;
	variant?: 'text' | 'outlined' | 'contained'; // Add variant as optional prop
}

/**
 * MightyButton: A button that adapts to mobile/desktop, showing icon and label appropriately.
 * - On desktop: MUI Button with startIcon and label
 * - On mobile: IconButton with Tooltip (label as tooltip)
 */

const MightyButton: React.FC<MightyButtonProps> = ({ icon, label, mobileOnly, mode = 'auto', variant = 'contained', ...props }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	// Determine which mode to use
	let renderMode: MightyButtonMode = 'auto';
	if (mode && mode !== 'auto') {
		renderMode = mode;
	} else if (isMobile || mobileOnly) {
		renderMode = 'iconbutton';
	} else {
		renderMode = 'button';
	}

	if (renderMode === 'iconbutton') {
		return (
			<Tooltip title={label}>
				<span>
					<IconButton color="primary" aria-label={label} {...props}>
						<Icon icon={icon as any} />
					</IconButton>
				</span>
			</Tooltip>
		);
	}

	// Default to button
	return (
		<Button
			variant={variant}
			color="primary"
			startIcon={<Icon icon={icon as any} />}
			{...props}
		>
			{label}
		</Button>
	);
};

export default MightyButton;