"use client";
import type { T_Frontmatter, T_NavItem, I_NestedNav } from '../../types';
import * as React from 'react';
import { Nav } from '../../DesignSystem';

export interface I_Footer {
	frontmatter?: T_Frontmatter;
	navItems?: T_NavItem[];
}

export default function Footer({ frontmatter, navItems }: I_Footer) {
	return (
		<div
			style={{
				position: 'fixed',
				bottom: 8,
				left: '50%',
				transform: 'translateX(-50%)',
				zIndex: 9999,
			}}
		>
			<Nav
				mode="mobile"
				navItems={navItems as I_NestedNav["navItems"]}
				frontmatter={frontmatter}
			/>
		</div>
	);
}
