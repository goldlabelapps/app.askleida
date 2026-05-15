import { Metadata } from "next";
import {
    Box,
    Container,
} from '@mui/material';
import { NX } from '../../NX';
import { getTenant, getMeta } from '../../NX/lib/index.server';
import { Header, Footer } from '../../NX/DesignSystem';
import type { T_Tenant } from '../../NX/types';
import { RegisterForm } from './RegisterForm';

export const metadata: Metadata = {
    title: "Register",
};

export default async function RegisterPage() {
    const tenant = process.env.NEXT_PUBLIC_TENANT || "nx";
    const { config: rawConfig } = getTenant(tenant as T_Tenant);
    const config = { ...rawConfig, tenant: tenant as T_Tenant };
    const meta = getMeta({
        siteName: config.siteName,
        title: `Register | ${config.siteName}`,
        description: config.description || "",
        url: `${config.url || ""}/account/register`,
        image: config.images?.light || "",
    });

    return (
        <NX config={config} frontmatter={{}}>
            <Header config={config} frontmatter={{}} />
            <Container maxWidth="sm" sx={{ mt: '120px', pb: '90px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <RegisterForm />
                </Box>
            </Container>
        </NX>
    );
}
