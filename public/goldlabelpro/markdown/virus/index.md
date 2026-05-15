---
order: 3333
title: Virus°
description: Gamified marketing construct
slug: /virus
icon: virus
image: /shared/png/virus/og_virus.png
---

The **Virus°** concept in this codebase represents a modular, interactive, and data-driven simulation of a virus and its spread, designed for use in a Next.js/React application. It is not a literal biological virus, but a metaphorical or gamified construct, possibly for educational, entertainment, or experimental purposes.

#### Key Features & Components
- **VirusPage**: Main UI for displaying virus data, including infection, mutation, and mortality rates, and transmission vectors. It uses a visually rich card with overlays and statistics.
- **InfoPane**: Provides contextual information, clever text, and avatar/icon for the virus. It can open dialogs and display dynamic messages.
- **Redux Integration**: Uses Uberedux for state management, with actions like `init`, `newVirus`, `set`, `update`, `check`, `stopCheck`, and `toggleDialog`.
- **Prompts**: Includes prompt functions like `spreadVirus` and `virusOutbreak` for simulating or describing virus spread events.
- **Hooks**: Custom hooks such as `useVirus`, `useFingerprint`, `useIPGeo`, and `useFirestoreDoc` for managing virus state, user/device fingerprinting, geolocation, and Firestore integration.
- **Components**: Modular components for navigation (`NavVirus`), information display (`InfoPane`), and spread visualization (`Spread`).
- **Firestore Integration**: Real-time data fetching and updates for virus instances using Firestore.

#### Data Model
- **Virus Object**: Contains properties like `infectionRate`, `mutationRate`, `mortalityRate`, `transmissionModes`, and `name`.
- **User/Device Fingerprinting**: Used for tracking or personalizing the virus experience.

#### UI/UX
- **Material UI**: Uses MUI for layout, dialogs, buttons, and responsive design.
- **CleverText**: Dynamic, possibly AI-driven, text output for user engagement.
- **Mapbox**: (Referenced) for geospatial visualization.

#### Example Usage
- Viewing a virus instance and its stats.
- Simulating the spread of a virus with `spreadVirus`.
- Displaying contextual info and avatars in the InfoPane.
- Real-time updates as virus data changes in Firestore.

#### Developer Notes
- The concept is extensible: new actions, hooks, and UI elements can be added for richer simulations.
- The term "virus" is used metaphorically; ensure ethical and appropriate use in your application context.
- The code is modular and leverages Next.js app directory structure for routing and API endpoints.

#### Related Files
- `Virus.tsx`, `index.tsx` (core logic and exports)
- `components/` (UI elements)
- `actions/` (Redux actions)
- `hooks/` (custom hooks)
- `prompts/` (simulation logic)

_Last updated: 1 May 2026_
