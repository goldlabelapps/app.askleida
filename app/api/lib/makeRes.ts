import type { I_MakeRes } from '../../NX/types';
import { getBaseurl } from './getBaseurl';
import { makeTime } from './makeTime';

export function makeRes({ severity, message, data, tenant, meta }: I_MakeRes) {
    const epoch = Date.now();
    const baseMeta = {
        time: makeTime(epoch),
        tenant,
        baseURL: getBaseurl(),
        severity,
        message,
    };
    
    const mergedMeta = meta ? { ...baseMeta, ...meta } : baseMeta;
    return data !== undefined
        ? { meta: mergedMeta, data }
        : { meta: mergedMeta };
}
