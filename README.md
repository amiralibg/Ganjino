# Ganjino (گنجینو)

Monorepo for Ganjino — a savings goal tracker. Managed with [pnpm workspaces](https://pnpm.io/workspaces) and [Turborepo](https://turbo.build/).

## Structure

```
apps/
  mobile/    Expo / React Native app   (was ganjino-app)
  admin/     Vite + React admin panel  (was ganjino-admin)
  backend/   Node + Express + MongoDB API (was ganjino-backend)
packages/    Shared code (reserved for future use)
```

## Prerequisites

- Node.js >= 20
- pnpm 10 (`corepack enable` or `npm i -g pnpm`)

## Getting started

```bash
pnpm install        # installs all workspaces
pnpm dev            # runs the dev task for every app via Turbo
pnpm build          # builds all apps
pnpm lint           # lints all apps
pnpm typecheck      # type-checks all apps
```

Run a task for a single app with a filter:

```bash
pnpm --filter ganjino dev          # mobile (Expo)
pnpm --filter ganjino-admin dev    # admin
pnpm --filter ganjino-backend dev  # backend
```

Each app keeps its own `README.md`, `.env.example`, and scripts — see the
respective folder under `apps/` for details.

## History

This repo was assembled from three previously independent repositories. The
full commit history of each was preserved under its `apps/` subdirectory.
