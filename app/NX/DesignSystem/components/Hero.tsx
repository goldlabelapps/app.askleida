"use client";
import type { T_Config, T_Frontmatter, T_NavItem } from '../../types';

import Image from 'next/image';
import React from 'react';
import { Box, useTheme } from '@mui/material';

export type T_Hero = {
	children?: React.ReactNode;
	config: T_Config;
	frontmatter?: T_Frontmatter;
	navItems?: T_NavItem[];
}

export default function Hero({
	frontmatter,
}: T_Hero) {

	// Use MUI theme
	const theme = useTheme();
	const themeMode = theme?.palette?.mode || 'light';

	let src = null;
	if (frontmatter && frontmatter.image) {
		const image = frontmatter.image;
		// Check if image ends with a known image extension
		const isImageFile = /\.(png|jpe?g|svg|webp|gif|avif|bmp)$/i.test(image);
		if (!isImageFile) {
			// Treat as directory path, append light.png or dark.png
			src = image.replace(/\/$/, '') + `/${themeMode}.png`;
		} else {
			src = image;
		}
	}
	if (!src) return null;

	return (
		<Box sx={{
			my: 2,
		}}>
			<Box
				sx={{
					width: '100%',
					height: '275px',
					maxHeight: '275px',
					position: 'relative',
					overflow: 'hidden',
					borderRadius: 2,
				}}
			>
				<Image
					src={src}
					alt={frontmatter?.title || 'Hero Image'}
					fill
					style={{
						objectFit: 'cover',
						objectPosition: 'center',
						width: '100%',
						height: '100%',
					}}
					sizes="100vw"
					priority
				/>
			</Box>
		</Box>
	);
}
