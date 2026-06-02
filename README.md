# askleida.com

Next.js 16 application for the Leida platform.

## Live

- Production: https://askleida.com

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- ESLint 9 with `eslint-config-next`
- Supabase (data + auth)
- Stripe (checkout + webhook)
- Anthropic API route (server-side)
- PWA support via `@ducanh2912/next-pwa`

## Prerequisites

- Node.js 20+
- Yarn 1.x (repo includes `yarn.lock`)

## Local Development

1. Install dependencies:

	```bash
	yarn install
	```

2. Create local env file:

	```bash
	cp .env.example .env.local
	```

3. Start the app:

	```bash
	yarn dev
	```

4. Open `http://localhost:1888`.

## Available Scripts

- `yarn dev` - kills existing process, installs deps, clears `.next`, then runs Next.js dev server on port `1888`.
- `yarn build` - production build.
- `yarn start` - run production server.
- `yarn lint` - run ESLint.
- `yarn clean` - project cleanup helper script.
- `yarn kill` - stop process bound to local dev port(s).
- `yarn open` - convenience script from `app/NX/lib/bash/open.sh`.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values.

Core:

- `NEXT_PUBLIC_TENANT`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Billing:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

AI:

- `ANTHROPIC_API_KEY`

Optional features:

- `NEXT_PUBLIC_PYTHON_URL`
- `NEXT_PUBLIC_MAPBOX_TOKEN`
- `NEXT_PUBLIC_IPGEOLOCATION_API_KEY`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Project Structure

- `app/` - Next.js app routes and feature modules.
- `app/api/` - API routes (products, practitioners, stripe, anthropic).
- `app/Leida/` - Leida feature module (components, hooks, prompts, and actions).
- `app/NX/` - shared UI/system modules and utilities.
- `public/` - static assets, PWA files, tenant content.

## Notes

- Stripe integration requires valid runtime secrets for both checkout and webhook routes.
- If `NEXT_PUBLIC_TENANT` is missing or invalid, the app falls back to `askleida` defaults.
- Keep secrets in `.env.local` only. Do not commit credentials.