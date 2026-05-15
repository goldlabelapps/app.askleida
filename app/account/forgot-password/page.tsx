import { Metadata } from "next";
import {
    Box,
    Container,
} from '@mui/material';
import { NX } from '../../NX';
import { getTenant, getMeta } from '../../NX/lib/index.server';
import { Header, Footer } from '../../NX/DesignSystem';
import type { T_Tenant } from '../../NX/types';
import { ForgotPasswordForm } from './ForgotPasswordForm';

export const metadata: Metadata = {
    title: "Forgot Password",
};

export default async function ForgotPasswordPage() {
    const tenant = process.env.NEXT_PUBLIC_TENANT || "nx";
    const { config: rawConfig } = getTenant(tenant as T_Tenant);
    const config = { ...rawConfig, tenant: tenant as T_Tenant };
    const meta = getMeta({
        siteName: config.siteName,
        title: `Forgot Password | ${config.siteName}`,
        description: config.description || "",
        url: `${config.url || ""}/account/forgot-password`,
        image: config.images?.light || "",
    });

    return (
        <NX config={config} frontmatter={{}}>
            <Header config={config} frontmatter={{}} />
            <Container maxWidth="sm" sx={{ mt: '120px', pb: '90px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <ForgotPasswordForm />
                </Box>
            </Container>
        </NX>
    );
}
