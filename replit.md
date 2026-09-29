# MaternIA

Aplicación móvil en español de acompañamiento emocional para mujeres embarazadas y en posparto.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/maternia run typecheck` — typecheck the Expo mobile app
- `pnpm --filter @workspace/maternia run dev` — start the Expo preview (use the managed workflow for QR access)
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/maternia/app/` — Expo Router routes for auth, tabs, questionnaires, self-care, community and settings.
- `artifacts/maternia/components/Screens.tsx` — screen implementations and local AsyncStorage flows.
- `artifacts/maternia/components/UI.tsx` — shared brand components and styling.
- `artifacts/maternia/context/AppContext.tsx` — user and stage persistence.
- `artifacts/maternia/services/healthKitService.ts` — native-free HealthKit boundary for Expo Go.
- `artifacts/maternia/services/storage.ts` — AsyncStorage keys and JSON helpers.
- `artifacts/maternia/constants/colors.ts` — MaternIA mint, beige and lilac theme tokens.

## Architecture decisions

- The first build is frontend-only and uses AsyncStorage, matching the Expo Go requirement.
- HealthKit is isolated behind a native-free service so Expo Go can show the correct unavailable/demo state.
- Maps use telephone and geo deep links instead of `react-native-maps`, avoiding native compilation.
- Auth is intentionally local demo onboarding because the requested flow stores only name and email locally.

## Product

- Guided onboarding for pregnancy or postpartum stage.
- Daily mood check-ins with local emotional history.
- PHQ-9 and EPDS screening flows with saved results and clear non-diagnostic language.
- Breathing exercise, self-care library, resources, specialist demo directory, appointments and community posts.
- Apple Salud connection boundary with an Expo Go simulation and privacy-first messaging.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
