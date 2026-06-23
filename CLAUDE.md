# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack monorepo with a **Next.js 16** frontend and **NestJS 11** backend, both in TypeScript.

## Commands

### Frontend (`frontend/`)
```
npm run dev      # dev server on :3000
npm run build    # production build
npm run lint     # ESLint
```

### Backend (`backend/`)
```
npm run start:dev   # watch mode dev server
npm run build       # compile TypeScript → dist/
npm run lint        # ESLint + fix
npm run format      # Prettier format
npm run test        # unit tests (Jest)
npm run test:e2e    # end-to-end tests (Supertest)
npm run test:cov    # coverage report
```

> **Port conflict:** Both apps default to port 3000. Set `PORT` env var on the backend when running both simultaneously.

## Architecture

### Frontend (`frontend/`)
- **Next.js 16** (App Router) with React 19
- **Tailwind CSS 4** — uses new `@theme` directive syntax (differs from v3)
- **`@/*`** path alias maps to `frontend/`
- App entry: `app/layout.tsx` → `app/page.tsx`

> **Next.js 16 breaking changes:** APIs and conventions differ from training data. Before writing frontend code, read `node_modules/next/dist/docs/` for up-to-date guidance.

### Backend (`backend/`)
- **NestJS 11** on Express, standard Module → Controller → Service pattern
- Entry: `src/main.ts` bootstraps the app and reads `PORT` from env
- `experimentalDecorators` and `emitDecoratorMetadata` are enabled (required by NestJS)
- Build output goes to `dist/`; `deleteOutDir: true` in nest-cli.json clears it on each build

### Frontend ↔ Backend
Not yet connected. The backend exposes a REST API; the frontend will consume it via HTTP. Configure the backend port to avoid the default :3000 collision.

## Code Style (Backend)
- Single quotes, trailing commas (enforced by `.prettierrc`)
- `@typescript-eslint/no-explicit-any` is off; `@typescript-eslint/no-floating-promises` is warn
- Unit test files: `*.spec.ts` inside `src/`; e2e tests: `*.e2e-spec.ts` inside `test/`
