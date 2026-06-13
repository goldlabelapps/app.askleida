// @ts-ignore
import "./globals.css";
// @ts-ignore
import "./Leida/style.css";
import type { Metadata } from "next";
import { UbereduxProvider } from './NX/Uberedux';
import { RequireSupabaseAuth } from './NX/Paywall';
import { loadTenantConfigServer } from './lib/tenantConfig/server';

const { tenant, config } = loadTenantConfigServer();
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
