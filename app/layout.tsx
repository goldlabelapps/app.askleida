// @ts-ignore
import "./globals.css";
// @ts-ignore
import "./Leida/style.css";
import type { Metadata } from "next";
import fs from 'fs';
import path from 'path';
import { UbereduxProvider } from './NX/Uberedux';
import { RequireSupabaseAuth } from './NX/Paywall';
import type { T_Config } from './NX/types';

type TenantConfig = T_Config & {
  cartridges: T_Config['cartridges'] & {
    paywall?: {
      enabled?: boolean;
    };
  };
};

const DEFAULT_TENANT = 'askleida';
const requestedTenant = process.env.NEXT_PUBLIC_TENANT || DEFAULT_TENANT;
const defaultConfig: TenantConfig = {
  siteName: 'Leida',
  tenant: DEFAULT_TENANT,
  description: 'Homecare assistant for solo skin therapists',
  url: 'https://app.askleida.com',
  owner: {
    name: 'Leida',
    email: 'hello@askleida.com',
  },
  images: {
    light: '/askleida/png/banner/light.png',
    dark: '/askleida/png/banner/dark.png',
  },
  favicon: '/askleida/svg/favicon.svg',
  avatars: {
    light: '/askleida/svg/favicon.svg',
    dark: '/askleida/svg/favicon.svg',
  },
  cartridges: {
    paywall: { enabled: false },
  },
};

const readTenantConfig = (tenant: string): TenantConfig | null => {
  const configPath = path.join(process.cwd(), 'public', tenant, 'config.json');
  if (!fs.existsSync(configPath)) {
    return null;
  }

  try {
    const configRaw = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(configRaw) as TenantConfig;
  } catch (error) {
    console.error(`[layout] Failed to read config for tenant "${tenant}"`, error);
    return null;
  }
};

const loadTenantConfig = () => {
  const requestedConfig = readTenantConfig(requestedTenant);
  if (requestedConfig) {
    return { tenant: requestedTenant, config: requestedConfig };
  }

  const fallbackConfig = readTenantConfig(DEFAULT_TENANT);
  if (fallbackConfig) {
    if (requestedTenant !== DEFAULT_TENANT) {
      console.warn(
        `[layout] Missing config for tenant "${requestedTenant}". Falling back to "${DEFAULT_TENANT}".`
      );
    }
    return { tenant: DEFAULT_TENANT, config: fallbackConfig };
  }

  console.error('[layout] No tenant config found. Using safe defaults.');
  return {
    tenant: DEFAULT_TENANT,
    config: defaultConfig,
  };
};

const { tenant, config } = loadTenantConfig();
const title = config.siteName || 'Leida';
const description = config.description || 'Homecare assistant for solo skin therapists';
const favicon = config.favicon || '/askleida/svg/favicon.svg';
const manifestHref = `/${tenant}/manifest.json`;

export const metadata: Metadata = {
  title,
  description,
  manifest: manifestHref,
  icons: {
    icon: favicon,
    shortcut: favicon,
    apple: favicon,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <link rel="icon" href={favicon} />
        {manifestHref ? <link rel="manifest" href={manifestHref} /> : null}
        <meta name="application-name" content={title} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={title} />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <div className="wrapper">
          <UbereduxProvider config={config}>
            <RequireSupabaseAuth publicUrl={tenant}>
              {children}
            </RequireSupabaseAuth>
          </UbereduxProvider>
        </div>
      </body>
    </html>
  );
}
