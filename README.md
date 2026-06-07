<div align="center">
  <img src="./assets/icon.png" alt="Ganjino" width="120" height="120" />

  <h1>Ganjino — گنجینو</h1>

  <p>A savings goal tracker that helps you save toward goals, priced in gold.</p>

  <p>
    <img alt="version" src="https://img.shields.io/badge/version-0.0.1-D4AF37" />
    <img alt="license" src="https://img.shields.io/badge/license-MIT-blue" />
    <img alt="pnpm" src="https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm&logoColor=white" />
    <img alt="turborepo" src="https://img.shields.io/badge/Turborepo-2-EF4444?logo=turborepo&logoColor=white" />
    <img alt="node" src="https://img.shields.io/badge/node-%3E%3D20-339933?logo=nodedotjs&logoColor=white" />
  </p>
</div>

---

A monorepo managed with [pnpm workspaces](https://pnpm.io/workspaces) and
[Turborepo](https://turbo.build/). It contains the mobile app, the admin
dashboard, and the backend API.

## Apps

| App | Path | Stack | Description |
| --- | --- | --- | --- |
| 📱 **Mobile** | [`apps/mobile`](apps/mobile) | Expo · React Native · Expo Router · Zustand · React Query | The user-facing savings tracker app (iOS & Android). |
| 🖥️ **Admin** | [`apps/admin`](apps/admin) | Vite · React 19 · Tailwind · React Query | Admin dashboard for managing the platform. |
| ⚙️ **Backend** | [`apps/backend`](apps/backend) | Node · Express 5 · MongoDB (Mongoose) · JWT · Swagger | REST API, auth, and gold-price tracking. |

```
ganjino/
├── apps/
│   ├── mobile/    Expo / React Native app
│   ├── admin/     Vite + React admin panel
│   └── backend/   Node + Express + MongoDB API
├── packages/      Shared code (reserved for future use)
├── turbo.json     Turborepo task pipeline
└── pnpm-workspace.yaml
```

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [pnpm](https://pnpm.io/) 10 — `corepack enable` (or `npm i -g pnpm`)

## Getting started

```bash
pnpm install     # install every workspace
pnpm dev         # run the dev task for all apps (Turbo)
pnpm build       # build all apps
pnpm lint        # lint all apps
pnpm typecheck   # type-check all apps
```

### Run a single app

```bash
pnpm --filter ganjino dev          # mobile (Expo)
pnpm --filter ganjino-admin dev    # admin
pnpm --filter ganjino-backend dev  # backend
```

Each app keeps its own `README.md`, `.env.example`, and scripts — see the
folder under [`apps/`](apps) for setup details specific to that app.

## Environment

Every app ships an `.env.example`. Copy it to `.env` inside the relevant app
folder and fill in the values before running:

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/mobile/.env.example  apps/mobile/.env
cp apps/admin/.env.example   apps/admin/.env
```

## History

This repo was assembled from three previously independent repositories. The
full commit history of each was preserved — browse it with
`git log --oneline --graph`.

## License

Released under the [MIT License](LICENSE).
