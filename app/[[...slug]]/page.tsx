import type { I_NestedNav, T_Tenant, T_Frontmatter } from '../NX/types';
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
    Box,
} from '@mui/material';
import { NX } from '../NX';
import {
    Icon,
} from '../NX/DesignSystem';
import {
    Dashboard,
} from '../NX/Dashboard';
import { RenderMarkdown } from '../NX/Shortcodes';

export default async function Page(props: any) {
   

    // fallback to original rendering for all other routes
    return (
        <>Landing page</>
    );
}
