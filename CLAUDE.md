# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack monorepo: **Next.js 16** frontend and **NestJS 12** backend (TypeORM + PostgreSQL), wired together by Docker Compose. There is no workspace root `package.json` — `frontend/` and `backend/` are independent npm packages, so `npm install` must be run in each.

## Commands

### Full stack (Docker Compose, from repo root)
```
cp .env.example .env        # required first — compose interpolates every var, none have defaults
docker compose up --build
```
Brings up `postgres`, `backend`, `frontend` on a shared `app-network` bridge. `.env` is gitignored; `.env.example` is the template.

Both Dockerfiles build **production** images and compose declares no bind mounts, so source edits do not hot-reload — re-run with `--build`, or use the per-app dev servers below for iteration.

### Frontend (`frontend/`)
```
npm run dev      # dev server on :3000
npm run build    # production build
npm run lint     # ESLint
```

### Backend (`backend/`)
```
npm run start:dev          # watch mode dev server
npm run build              # compile TypeScript → dist/
npm run lint               # ESLint + fix
npm run format             # Prettier format
npm run test               # unit tests (Jest)
npm run test:e2e           # end-to-end tests (Supertest)
npm run test:cov           # coverage report

npm run migration:generate -- src/database/migrations/<Name>   # diff entities → new migration
npm run migration:create -- src/database/migrations/<Name>     # empty migration
npm run migration:run      # apply pending migrations
npm run migration:revert   # roll back the last one
```

Running a single test:
```
npm test -- app.controller          # by filename pattern
npm test -- -t "should return"      # by test name
npm run test:e2e -- -t "/ (GET)"    # same flags work for e2e
```

Migration commands need a reachable database (`docker compose up postgres`) and read `POSTGRES_*` from the environment — they do **not** load `.env`, so export the vars or prefix the command.

### Ports
`.env.example` resolves the default :3000 collision: frontend on host **3000**, backend on host **3001** (container-internal 3000, set via `PORT`), postgres on **5432**. Running the dev servers outside compose means setting `PORT` on the backend yourself.

## Architecture

### Frontend (`frontend/`)
- **Next.js 16** (App Router) with React 19; entry `app/layout.tsx` → `app/page.tsx`
- **Tailwind CSS 4** — new `@theme` directive syntax in `app/globals.css` (differs from v3)
- **`@/*`** path alias maps to `frontend/`
- `next.config.ts` sets `output: "standalone"` — the Dockerfile copies `.next/standalone` and runs `server.js`. Removing it breaks the image.

> **Next.js 16 breaking changes:** APIs and conventions differ from training data. Read `node_modules/next/dist/docs/` before writing frontend code. (`frontend/CLAUDE.md` → `frontend/AGENTS.md` repeats this for frontend-scoped sessions.)

### Backend (`backend/`)
- **NestJS 12** on Express, standard Module → Controller → Service pattern; requires **TypeScript >= 6** (project pins `^6.0.3`, the last release still within `ts-jest`/`typescript-eslint`'s supported range — do not jump to TS 7 without upgrading those first)
- Entry: `src/main.ts` bootstraps the app and reads `PORT` from env
- `experimentalDecorators` and `emitDecoratorMetadata` enabled (required by NestJS)
- `tsconfig.json` sets `"types": ["node", "jest"]` explicitly — TS 6+ no longer auto-includes ambient `@types/*` packages the way TS 5 did, so a new global type source (e.g. another `@types/*` package) must be added here or it silently won't resolve
- Build output goes to `dist/`; `deleteOutDir: true` in `nest-cli.json` clears it each build

### Database layer
TypeORM is configured **twice**, and both copies must be kept in sync when connection settings change:

| | `src/app.module.ts` (`TypeOrmModule.forRoot`) | `src/database/data-source.ts` (`AppDataSource`) |
|---|---|---|
| used by | the running app | the `typeorm` CLI / migration scripts |
| entities | `__dirname + '/**/*.entity{.ts,.js}'` | `src/**/*.entity.ts` |
| migrations | `__dirname + '/database/migrations/*{.ts,.js}'` | `src/database/migrations/*.ts` |

The `__dirname`-based globs resolve against `dist/` at runtime and `src/` under ts-node — that is why the two differ. Connection settings in both read `POSTGRES_HOST/PORT/USER/PASSWORD/DB` with localhost/postgres/fully_db fallbacks.

- `synchronize: false` everywhere — **schema changes require a migration**, never auto-sync.
- `migrationsRun: true` in `app.module.ts` — pending migrations apply automatically on app boot, including in the Docker image.
- `src/database/migrations/` does not exist yet; no entities have been defined.

### Feature modules (`backend/src/modules/`)
Feature code lives under `modules/<name>/` with `controllers/`, `services/`, `interfaces/` subfolders (and `dto/`, `guards/`, `strategies/`, `decorators/` as needed) rather than flat per-feature folders — follow this layout for new modules.

### Auth (`backend/src/modules/auth/`, `backend/src/modules/users/`)
JWT auth via `@nestjs/jwt` + `@nestjs/passport` (`passport-jwt`), documented in Swagger with a Bearer scheme:
- `POST /auth/login` (`AuthController`) exchanges username/password for a JWT; `GET /auth/profile` is a demo route protected by `JwtAuthGuard` (`@UseGuards(JwtAuthGuard)` + `@ApiBearerAuth()`) — use it as the template for protecting new routes.
- `JwtStrategy` verifies the token against `JWT_SECRET`; `JwtModule` in `auth.module.ts` reads `JWT_SECRET`/`JWT_EXPIRES_IN` from env (see `.env.example`, `docker-compose.yml`).
- Credential lookup goes through `modules/users/services/user.service.ts` (`UserService.findOne`) — currently a **hardcoded in-memory user** (`admin`/`changeme`, bcrypt-hashed), since no User entity/table exists yet. Swap it for a TypeORM repository later without changing `AuthService`'s calling shape.
- `modules/users/user.module.ts` exports `UserService` (not `UserController` — controllers aren't providers, exporting one is meaningless for DI); `AuthModule` imports `UsersModule` for this.
- Global `ValidationPipe` (`main.ts`) enforces DTO validation (`class-validator`) on all routes, not just auth.

### API docs (Swagger)
`main.ts` mounts Swagger UI at **`/api`** via `DocumentBuilder`/`SwaggerModule`, with a Bearer auth scheme registered (`addBearerAuth`) — paste a token from `POST /auth/login` into the "Authorize" button to call protected routes from the UI. Any controller method needs `@ApiBearerAuth()` (matching the guard) to show the padlock.

### Frontend ↔ Backend
Not yet connected. Compose passes `NEXT_PUBLIC_API_URL` (default `http://localhost:3001`) to the frontend container. Note that Next.js inlines `NEXT_PUBLIC_*` at **build** time while compose supplies it at **run** time — client-side reads will be undefined until it is also passed as a Docker build arg. Server-side code reading `process.env` at runtime is unaffected, and from inside the compose network the backend is reachable at `http://backend:3000`.

## Code Style (Backend)
- Single quotes, trailing commas (enforced by `.prettierrc`)
- `@typescript-eslint/no-explicit-any` is off; `@typescript-eslint/no-floating-promises` is warn
- Unit tests: `*.spec.ts` inside `src/`; e2e tests: `*.e2e-spec.ts` inside `test/`
