import type { T_Config } from '../../NX/types';

export type TenantConfig = T_Config & {
  cartridges: T_Config['cartridges'] & {
    paywall?: {
      enabled?: boolean;
    };
  };
};

export const DEFAULT_TENANT = 'askleida';

export const getRequestedTenant = () => process.env.NEXT_PUBLIC_TENANT || DEFAULT_TENANT;

export const defaultTenantConfig: TenantConfig = {
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

type ResolveTenantConfigInput = {
  requestedTenant: string;
  requestedConfig: TenantConfig | null;
  fallbackConfig: TenantConfig | null;
  logPrefix: string;
};

export const resolveTenantConfig = ({
  requestedTenant,
  requestedConfig,
  fallbackConfig,
  logPrefix,
}: ResolveTenantConfigInput) => {
  if (requestedConfig) {
    return {
      tenant: requestedTenant,
      config: requestedConfig,
    };
  }

  if (fallbackConfig) {
    if (requestedTenant !== DEFAULT_TENANT) {
      console.warn(
        `[${logPrefix}] Missing config for tenant "${requestedTenant}". Falling back to "${DEFAULT_TENANT}".`
      );
    }

    return {
      tenant: DEFAULT_TENANT,
      config: fallbackConfig,
    };
  }

  console.error(`[${logPrefix}] No tenant config found. Using safe defaults.`);

  return {
    tenant: DEFAULT_TENANT,
    config: defaultTenantConfig,
  };
};
