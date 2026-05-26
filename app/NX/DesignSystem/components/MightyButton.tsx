'use client';
import * as React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Icon } from '../../DesignSystem';

interface MightyButtonProps extends React.ComponentProps<typeof Button> {
	icon: string;
	label: string;
	mobileOnly?: boolean;
}

/**
 * MightyButton: A button that adapts to mobile/desktop, showing icon and label appropriately.
 * - On desktop: MUI Button with startIcon and label
 * - On mobile: IconButton with Tooltip (label as tooltip)
 */
const MightyButton: React.FC<MightyButtonProps> = ({ icon, label, mobileOnly, ...props }) => {
	const theme = useTheme();
	// You can adjust the breakpoint as needed
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	if (isMobile || mobileOnly) {
		return (
			<Tooltip title={label}>
				<span>
					<IconButton 
                        color="primary"
                        aria-label={label} {...props}>
						<Icon icon={icon as any} />
					</IconButton>
				</span>
			</Tooltip>
		);
	}

	return (
		<Button 
            variant="contained" 
            color="primary"
            startIcon={<Icon icon={icon as any} />} 
            {...props}>
			{label}
		</Button>
	);
};

export default MightyButton;