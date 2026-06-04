import * as React from 'react';
import { Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material';
import Editable from './Editable';
import { Icon } from '../../../NX/DesignSystem';

type T_BulletEditorProps = {
	value: string[];
	onChange: (nextValue: string[]) => void;
	disabled?: boolean;
};

const moveItem = (items: string[], fromIndex: number, toIndex: number): string[] => {
	if (fromIndex === toIndex) {
		return items;
	}

	if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length) {
		return items;
	}

	const nextItems = [...items];
	const [movedItem] = nextItems.splice(fromIndex, 1);
	nextItems.splice(toIndex, 0, movedItem);
	return nextItems;
};

export default function BulletEditor({
	value,
	onChange,
	disabled = false,
}: T_BulletEditorProps) {
	const [focusNewBullet, setFocusNewBullet] = React.useState(false);
	const bullets = Array.isArray(value) ? value.map((item) => (typeof item === 'string' ? item : '')) : [];

	React.useEffect(() => {
		if (focusNewBullet) {
			setFocusNewBullet(false);
		}
	}, [focusNewBullet, bullets.length]);

	const handleAddBullet = () => {
		setFocusNewBullet(true);
		onChange(['', ...bullets]);
	};

	const handleBulletChange = (index: number, nextBullet: string) => {
		const nextBullets = [...bullets];
		nextBullets[index] = nextBullet;
		onChange(nextBullets);
	};

	const handleRemoveBullet = (index: number) => {
		onChange(bullets.filter((_, bulletIndex) => bulletIndex !== index));
	};

	const handleMoveBullet = (index: number, direction: -1 | 1) => {
		onChange(moveItem(bullets, index, index + direction));
	};

	return (
		<Box sx={{ mt: 2 }}>
			{bullets.length ? (
				<Box sx={{ display: 'flex', alignItems: 'center', 
                justifyContent: 'space-between', mb: 1 }}>
	    			<Button variant="text" startIcon={<Icon icon="add" />} onClick={handleAddBullet} disabled={disabled}>
						Add bullet
					</Button>
				</Box>
			) : null}

			{bullets.length ? (
				<Stack spacing={1.5}>
					{bullets.map((bullet, index) => (
						<Box key={index} 
                        sx={{ display: 'flex', gap: 1, 
                        alignItems: 'flex-start' }}>
							<Box sx={{ 
                                display: 'flex', 
                                gap: 0.25,
                                pt: 1 }}>
                                <IconButton
                                    color="primary"
                                    size="small"
                                    aria-label={`remove bullet ${index + 1}`}
                                    onClick={() => handleRemoveBullet(index)}
                                    disabled={disabled}
                                >
                                    <Icon icon="delete" />
                                </IconButton>
								<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
									<IconButton
										color="primary"
										size="small"
										aria-label={`move bullet ${index + 1} up`}
										onClick={() => handleMoveBullet(index, -1)}
										disabled={disabled || index === 0}
									>
										<Icon icon="up" />
									</IconButton>
									<IconButton
										color="primary"
										size="small"
										aria-label={`move bullet ${index + 1} down`}
										onClick={() => handleMoveBullet(index, 1)}
										disabled={disabled || index === bullets.length - 1}
									>
										<Icon icon="down" />
									</IconButton>
								</Box>
								
							</Box>
							<Box sx={{ flex: 1 }}>
								<Editable
									label={`Bullet ${index + 1}`}
									value={bullet}
									placeholder="Add bullet text"
									autoFocus={focusNewBullet && index === 0}
									multiline
									minRows={3}
									disabled={disabled}
									onChange={(nextBullet) => handleBulletChange(index, nextBullet)}
								/>
							</Box>
						</Box>
					))}
				</Stack>
			) : (
				<Button variant="outlined" startIcon={<Icon icon="add" />} onClick={handleAddBullet} disabled={disabled}>
					Add first bullet
				</Button>
			)}
		</Box>
	);
}