import fs from 'fs';
import path from 'path';
import type { TenantConfig } from './base';
import { DEFAULT_TENANT, getRequestedTenant, resolveTenantConfig } from './base';

const readTenantConfigFromFile = (tenant: string, logPrefix: string): TenantConfig | null => {
  const configPath = path.join(process.cwd(), 'public', tenant, 'config.json');

  if (!fs.existsSync(configPath)) {
    return null;
  }

  try {
    const configRaw = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(configRaw) as TenantConfig;
  } catch (error) {
    console.error(`[${logPrefix}] Failed to read config for tenant "${tenant}"`, error);
    return null;
  }
};

export const loadTenantConfigServer = () => {
  const requestedTenant = getRequestedTenant();
  const requestedConfig = readTenantConfigFromFile(requestedTenant, 'layout');
  const fallbackConfig = readTenantConfigFromFile(DEFAULT_TENANT, 'layout');

  return resolveTenantConfig({
    requestedTenant,
    requestedConfig,
    fallbackConfig,
    logPrefix: 'layout',
  });
};
