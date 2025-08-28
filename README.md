# the-winner-app — Monorepo (NestJS + React/Vite) con pnpm

Monorepo listo para trabajar en equipo con **backend en NestJS** y **frontend en React (Vite + TS)**, gestionado con **pnpm workspaces**. Se fuerza el uso de `pnpm` (bloquea npm/yarn/bun) y se incluye **CI en GitHub Actions**.

> FE: Vite en `apps/frontend` (puerto 5173) • BE: Nest en `apps/backend` (puerto 3000)

---

## Tabla de contenido
- [the-winner-app — Monorepo (NestJS + React/Vite) con pnpm](#the-winner-app--monorepo-nestjs--reactvite-con-pnpm)
  - [Tabla de contenido](#tabla-de-contenido)
  - [Stack](#stack)
  - [Estructura](#estructura)
  - [Requisitos](#requisitos)
  - [Primeros pasos](#primeros-pasos)
  - [Scripts útiles](#scripts-útiles)
  - [Variables de entorno](#variables-de-entorno)
  - [Backend (`apps/backend/.env`)](#backend-appsbackendenv)
  - [Frontend (`apps/frontend/.env`)](#frontend-appsfrontendenv)
  - [Uso en el frontend](#uso-en-el-frontend)
  - [Plantillas](#plantillas)
  - [`apps/frontend/.env.template` → `apps/frontend/.env` antes de correr los servicios.](#appsfrontendenvtemplate--appsfrontendenv-antes-de-correr-los-servicios)
  - [Flujo de trabajo en equipo](#flujo-de-trabajo-en-equipo)
  - [Convención de commits](#convención-de-commits)
  - [CI/CD](#cicd)
  - [Generadores Nest](#generadores-nest)
  - [Troubleshooting](#troubleshooting)

---

## Stack

- **Node**: 22.14.0 (`.nvmrc`)
- **Package manager**: `pnpm@9.x` (forzado con `only-allow` y `packageManager` en `package.json`)
- **Frontend**: React + Vite + TypeScript
- **Backend**: NestJS
- **CI**: GitHub Actions (`.github/workflows/ci.yml`)
- **Estilo**: ESLint + Prettier
- **TS Config compartido**: `packages/tsconfig`

---

## Estructura

```
the-winner-app/
├─ apps/
│  ├─ backend/                # NestJS
│  │  ├─ src/ (main.ts, app.*)
│  │  ├─ nest-cli.json
│  │  ├─ tsconfig.json
│  │  ├─ .env.template
│  │  └─ package.json
│  └─ frontend/               # React + Vite + TS
│     ├─ src/ (main.tsx, App.tsx, config.ts)
│     ├─ index.html
│     ├─ vite.config.ts
│     ├─ tsconfig.json
│     ├─ .env.template
│     └─ package.json
├─ packages/
│  └─ tsconfig/
│     ├─ base.json
│     └─ package.json
├─ .github/workflows/ci.yml
├─ .editorconfig
├─ .gitignore
├─ .env.template
├─ .npmrc
├─ .nvmrc
├─ package.json               # workspaces + scripts monorepo
├─ pnpm-workspace.yaml
└─ tsconfig.base.json
```

---

## Requisitos

- **Node 22.14.0** (`nvm use` toma la versión de `.nvmrc`)
- **Corepack habilitado**: `corepack enable`
- **pnpm 9.x** (Corepack lo gestiona automáticamente)

---

## Primeros pasos

```bash
# 1) Instalar dependencias
pnpm install

# 2) Ejecutar ambas apps en dev (en paralelo)
pnpm dev
# FE: http://localhost:5173
# BE: http://localhost:3000

# Opcional: correr solo un paquete
pnpm --filter @the-winner-app/frontend dev
pnpm --filter @the-winner-app/backend dev
```

> El script `preinstall` usa `only-allow` para bloquear npm/yarn/bun. Si ves un error, instala/usa **pnpm**.

---

## Scripts útiles

**Raíz (afectan a todos los paquetes):**
```bash
pnpm build
pnpm lint
pnpm test
pnpm format
```

**Frontend:**
```bash
pnpm --filter @the-winner-app/frontend dev
pnpm --filter @the-winner-app/frontend build
pnpm --filter @the-winner-app/frontend preview
```

**Backend (Nest):**
```bash
pnpm --filter @the-winner-app/backend dev
pnpm --filter @the-winner-app/backend build
```

---

## Variables de entorno

Usamos **archivos `.env` por app** y **no** se suben al repo. Solo se versionan los `.env.template` de cada app como referencia.

> ⚠️ No usamos `.env` en la raíz para evitar fugas al frontend y confusiones en el backend.

## Backend (`apps/backend/.env`)
```dotenv
# Recomendado
PORT=3000
CORS_ORIGIN=http://localhost:5173
API_PREFIX=api
API_VERSION=1
NODE_ENV=development


# Opcional
# DATABASE_URL=postgres://user:pass@localhost:5432/db
```
- El backend carga y valida estas variables con `@nestjs/config` al iniciar (no uses `dotenv` manualmente).
- Las variantes `.env.local`, `.env.development`, `.env.production` también son soportadas.

## Frontend (`apps/frontend/.env`)
```dotenv
# La API ya incluye prefijo y versión
VITE_API_URL=http://localhost:3000/api/v1
```
- **Solo** variables que empiecen con `VITE_` (el resto no existe en el cliente).
- No pongas secretos aquí: todo lo de `VITE_*` queda público en el bundle.

## Uso en el frontend
Centraliza la lectura en un módulo de config (para no repetir `import.meta.env` por toda la app):

```ts
// apps/frontend/src/config.ts
export const config = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1'
} as const;
```

Ejemplo en `App.tsx`:
```ts
import { config } from './config';

const API = config.apiUrl;
// fetch(`${API}/lo-que-sea`)
```

## Plantillas
Copia `apps/backend/.env.template` → `apps/backend/.env` y
`apps/frontend/.env.template` → `apps/frontend/.env` antes de correr los servicios.
---

## Flujo de trabajo en equipo

**Modelo:** trunk-based con ramas cortas + PR + CI.

1. Actualízate y crea rama:
   ```bash
   git switch main
   git pull --rebase
   git switch -c feat/fe-login   # o feat/be-rate-limit, feat/full-profile
   ```

2. Desarrolla con commits pequeños:
   ```bash
   pnpm dev
   git add .
   git commit -m "feat(fe): login básico con validación"
   ```

3. Mantén tu rama al día:
   ```bash
   git fetch origin
   git rebase origin/main   # o merge si el equipo lo prefiere
   # resolver conflictos → git add . && git rebase --continue
   ```

4. Publica y abre PR:
   ```bash
   git push -u origin feat/fe-login
   ```

5. CI debe pasar (lint/test/build). Atiende comentarios y, al finalizar:
   - Merge con **Squash & Merge**.
   - Borrar rama.

**Nombres de rama sugeridos:**
- `feat/fe-*`, `fix/fe-*` para frontend
- `feat/be-*`, `fix/be-*` para backend
- `feat/full-*` para cambios FE+BE
- `hotfix/*` para urgencias en producción

---

## Convención de commits

Usa [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `ci:`
- Opcional `scope`: `feat(fe): ...`, `fix(be): ...`

Ejemplos:
```
feat(fe): página de login
fix(be): evitar 500 en perfil vacío
chore(ci): actualizar Node a 20.11
```

---

## CI/CD

**CI en PR y main**: `.github/workflows/ci.yml`
- Setup Node 22.14.0 + pnpm 9.x
- `pnpm lint`
- `pnpm test`
- `pnpm build`

**Protecciones recomendadas** (GitHub → Branch protection):
- PR requerido para `main`
- CI verde obligatorio
- 1–2 revisiones
- Bloquear push directo a `main`

---

## Generadores Nest

Ejecuta *Nest CLI* con pnpm en el paquete backend:
```bash
pnpm --filter @the-winner-app/backend exec nest g resource users
pnpm --filter @the-winner-app/backend exec nest g module users
pnpm --filter @the-winner-app/backend exec nest g controller users
pnpm --filter @the-winner-app/backend exec nest g service users
```

---

## Troubleshooting

- **“Please use pnpm”**: se activó `only-allow`. Instala/usa pnpm.
- **Conflictos de rebase**: edita archivos con `<<<<<<<`, prueba, `git add .`, `git rebase --continue`.
- **CI rojo**: revisa el paso que falla (lint/test/build), corrige y sube cambios.
- **Puertos ocupados**: cambia `PORT` o el `server.port` de Vite si chocan.
