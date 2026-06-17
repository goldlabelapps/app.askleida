export type T_OnboardingData = {
    setPassword: boolean;
    createFirstClient: boolean;
};

export type T_OnboardingState = {
    data?: T_OnboardingData;
    open?: boolean;
    completed?: boolean;
    brandNew?: boolean;
    loading?: boolean;
    initted?: boolean;
    error?: string | null;
    [key: string]: unknown;
};
