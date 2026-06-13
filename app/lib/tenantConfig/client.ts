import type { TenantConfig } from './base';
import { DEFAULT_TENANT, getRequestedTenant, resolveTenantConfig } from './base';

const readTenantConfigFromPublic = async (tenant: string, logPrefix: string): Promise<TenantConfig | null> => {
  try {
    const response = await fetch(`/${tenant}/config.json`, { cache: 'no-store' });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as TenantConfig;
  } catch (error) {
    console.error(`[${logPrefix}] Failed to read config for tenant "${tenant}"`, error);
    return null;
  }
};

export const loadTenantConfigClient = async () => {
  const requestedTenant = getRequestedTenant();
  const requestedConfig = await readTenantConfigFromPublic(requestedTenant, 'invite');
  const fallbackConfig = await readTenantConfigFromPublic(DEFAULT_TENANT, 'invite');

  return resolveTenantConfig({
    requestedTenant,
    requestedConfig,
    fallbackConfig,
    logPrefix: 'invite',
  });
};
