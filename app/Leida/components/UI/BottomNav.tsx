'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
	BottomNavigation,
	BottomNavigationAction,
	Paper,
} from '@mui/material';
import { useDispatch } from '../../../NX/Uberedux';
import { Icon, navigateTo } from '../../../NX/DesignSystem';
import type { I_Icon } from '../../../NX/types';

export interface I_BottomNavItem {
	label: string;
	value: string;
	icon: I_Icon['icon'];
	href?: string;
	onClick?: () => void;
	disabled?: boolean;
}

export interface I_BottomNav {
	items: I_BottomNavItem[];
	value: string;
	onChange?: (value: string) => void;
}

export default function BottomNav({
	items,
	value,
	onChange,
}: I_BottomNav) {

	const dispatch = useDispatch();
	const router = useRouter();

	const handleChange = React.useCallback(
		(_event: React.SyntheticEvent, nextValue: string) => {
			onChange?.(nextValue);
			const nextItem = items.find((item) => item.value === nextValue);
			if (nextItem?.href) {
				dispatch(navigateTo(router, nextItem.href));
			}
		},
		[dispatch, items, onChange, router],
	);

	
	return (
		<Paper
			elevation={8}
			sx={{
				position: 'fixed',
				left: 0,
				right: 0,
				bottom: 0,
				zIndex: (theme) => theme.zIndex.appBar,
				borderTopLeftRadius: 18,
				borderTopRightRadius: 18,
				overflow: 'hidden',
				pb: 'env(safe-area-inset-bottom)',
			}}
		>
			<BottomNavigation
				value={value}
				onChange={handleChange}
				showLabels={false}
			>
				{items.map((item) => {
					return (
						<BottomNavigationAction
							key={item.value}
							value={item.value}
							label={item.label}
							icon={<Icon icon={item.icon} />}
							onClick={item.onClick}
							disabled={item.disabled}
						/>
					);
				})}
			</BottomNavigation>
		</Paper>
	);
}
