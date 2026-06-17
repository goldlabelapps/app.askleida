## app.askleida.com

> Production: https://app.askleida.com

### Deploy to Vercel

1. Install the Vercel CLI or use the Vercel dashboard.
2. Ensure the project root is `/Users/milky/My Drive/GitHub/app.askleida`.
3. Add required environment variables in Vercel from `.env.example`.
4. Set the build command to `yarn build` and the output directory to `.`.
5. Deploy and confirm the preview/prod URL.

> Recommended env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_ANTHROPIC_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_TENANT`, plus any provider keys you use.

#### Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- ESLint 9 with `eslint-config-next`
- Supabase (data + auth)
- Stripe (checkout + webhook)
- Anthropic API route (server-side)
- PWA support via `@ducanh2912/next-pwa`

#### Prerequisites

- Node.js 20+
- Yarn 1.x (repo includes `yarn.lock`)

#### Local Development

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

#### Available Scripts

- `yarn dev` - kills existing process, installs deps, clears `.next`, then runs Next.js dev server on port `1888`.
- `yarn build` - production build.
- `yarn start` - run production server.
- `yarn lint` - run ESLint.
- `yarn clean` - project cleanup helper script.
- `yarn kill` - stop process bound to local dev port(s).
- `yarn open` - convenience script from `app/NX/lib/bash/open.sh`.

#### Notes

- PWA/service worker is disabled by default in development (`yarn dev`). Set `ENABLE_PWA_DEV=true` in `.env.local` to test it locally.
- Stripe integration requires valid runtime secrets for both checkout and webhook routes.
- If `NEXT_PUBLIC_TENANT` is missing or invalid, the app falls back to `askleida` defaults.
- Keep secrets in `.env.local` only. Do not commit credentials.