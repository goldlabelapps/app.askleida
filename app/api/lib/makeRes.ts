
import type { I_MakeRes } from "../../NX/types";
import { makeTime } from './makeTime';
import { getBaseurl } from './getBaseurl';

export function makeRes({ severity, message, data, tenant }: I_MakeRes) {
    const epoch = Date.now();
    const meta = {
        
        time: makeTime(epoch),
        tenant,
        baseURL: getBaseurl(),
        severity,
        message,
        
    };
    return data !== undefined
        ? { meta, data, tenant }
        : { meta };
};
