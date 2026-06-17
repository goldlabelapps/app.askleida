# Onboarding

This module manages practitioner onboarding status and presents a required onboarding dialog until all steps are complete.

## Steps

1. Set password (always complete)
2. Create first client
3. Publish first living routing

## Data model

Onboarding status is persisted under the practitioner `data.onboarding` key as booleans for each step.

If the `onboarding` key does not exist, the practitioner is treated as brand new.

## Module contents

- `Onboarding.tsx`: Dialog component and init effects
- `actions/initOnboarding.tsx`: Derives, syncs, and persists onboarding status
- `actions/setOnboarding.tsx`: Updates onboarding slice state
- `hooks/useOnboarding.tsx`: Selector hook
- `index.tsx`: Module exports
