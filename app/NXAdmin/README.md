# NXAdmin

First draft documentation for the NX admin area.

## What This Is

NXAdmin is a modular admin surface for managing app data, operations, and internal tools. It is built around a single top-level admin component and a barrel export that exposes pages, CRUD utilities, actions, hooks, and shared UI pieces.

Primary entry points:

- [NXAdmin.tsx](NXAdmin.tsx)
- [index.tsx](index.tsx)

## Core Responsibilities

- Render an authenticated admin experience
- Switch between desktop and mobile admin layouts
- Expose modular feature pages (accounts, prospects, queue, viruses, fingerprints, avatars)
- Provide reusable CRUD building blocks
- Centralize admin actions and hooks through the NXAdmin barrel

## High-Level Flow

1. NXAdmin mounts and initializes auth listeners.
2. If auth is not ready, it renders nothing.
3. If user is not authenticated, it renders a sign-in surface.
4. If user is authenticated, it renders desktop or mobile layout based on breakpoint.
5. Admin features are routed and composed from exported modules.

See implementation details in [NXAdmin.tsx](NXAdmin.tsx).

## Public Surface (Barrel Exports)

All major admin functionality is exported from [index.tsx](index.tsx).

### Main

- NXAdmin
- MegaDash

### Layout

- DesktopLayout
- MobileLayout
- Header
- PageRouter
- AdminNav

### Page Modules

- Collection
- Accounts
- Prospects
- Prospect
- Avatars
- TypeScript
- Queue
- Viruses
- Fingerprints
- Fingerprint
- FilterSelect

### CRUD Components

- CreateDoc
- ReadDoc
- UpdateDoc
- DeleteDoc

### UI Components

- InputString
- OptionSelect
- JSONInput
- SoundPlayer

### Menu Components

- NXAdminBtn
- NXAdminMenu
- CloseAdmin
- CancelActive
- MiniListItem
- AccountCard
- PWAAlert
- NotificationBell

### Actions

- setNXAdmin
- setCRUD
- saveNewDoc
- edit
- initCollection
- collectionDelete
- readTypescript
- subscribeUser
- pwaAlert
- triggerPwaInstall
- requestNotifications
- geoToString

### Hooks

- useNXAdmin
- useCRUD
- useCollection
- useActive
- useNotifications
- useHeader

## Folder Map

- [components](components): Admin UI modules and feature pages
- [actions](actions): Admin actions for state/data behavior
- [hooks](hooks): Reusable admin hooks
- [utils](utils): Shared utilities for formatting/transforms
- [types.d.ts](types.d.ts): Shared admin type definitions

## Type Strategy

Admin-wide types are centralized in [types.d.ts](types.d.ts). Feature modules should import shared types from this file rather than redefining them locally.

Current naming convention in this area:

- Interface names start with I_
- Type aliases start with T_

## Typical Integration Pattern

1. Import from the NXAdmin barrel.
2. Render NXAdmin with a valid config object.
3. Let NXAdmin handle auth gate and layout switching.
4. Use exported actions/hooks/components to build custom admin flows.

## Notes For Future Revision

This is a first draft. Recommended follow-up additions:

- Add concrete usage examples from the host app
- Add config schema details for the config prop
- Add development and test instructions for this folder
- Add per-module docs for Prospects, Queue, Viruses, and Fingerprints
