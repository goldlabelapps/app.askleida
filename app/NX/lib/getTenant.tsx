import type { T_Tenant } from '../types';
import config from '../../../public/askleida/config.json';

export const getTenant = (tenant?: T_Tenant) => {

    const t = tenant || process.env.NEXT_PUBLIC_TENANT;
    const markdownDir = process.cwd() + '/public/askleida/markdown';

    return {
        tenant: t,
        config,
        markdownDir
    };
};
