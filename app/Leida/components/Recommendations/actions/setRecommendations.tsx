import { setUbereduxKey } from '../../../../NX/Uberedux';

export const setRecommendations = (key: string, value: any): any =>
    setUbereduxKey({
        key: `recommendations.${key}`,
        value,
    });
