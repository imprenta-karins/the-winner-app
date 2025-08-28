# Guía de Contribución

¡Gracias por contribuir a **the-winner-app**! Este documento describe cómo trabajamos en equipo: desde clonar el repo hasta fusionar un PR y borrar la rama.

## Prerrequisitos

- **Node 22.14.0** (`nvm use` toma la versión de `.nvmrc`)
- **Corepack habilitado**: `corepack enable`
- **pnpm 9.x** (lo gestiona Corepack)
- Copiar las plantillas de entorno:
  - `apps/backend/.env.template` → `apps/backend/.env`
  - `apps/frontend/.env.template` → `apps/frontend/.env`

## Setup rápido (primera vez)

```bash
git clone https://github.com/AndresEduardoRA/the-winner-app.git
cd the-winner-app

nvm use        # o nvm-windows: nvm use 22.14.0
corepack enable
pnpm install

# Archivos .env
cp apps/backend/.env.template apps/backend/.env
cp apps/frontend/.env.template apps/frontend/.env
# (Windows PowerShell)
# Copy-Item apps\backend\.env.template apps\backend\.env
# Copy-Item apps\frontend\.env.template apps\frontend\.env

# Prueba local (opcional)
pnpm dev       # FE: 5173 | BE: 3000
```

> ⚠️ El script `preinstall` usa `only-allow` para forzar **pnpm**.

---

## Flujo de trabajo (trunk-based)

1. **Crear rama desde `main` actualizado**
   ```bash
   git switch main
   git pull --rebase
   git switch -c feat/fe-login   # o feat/be-*, feat/full-*, fix/*, hotfix/*
   ```

2. **Desarrollo y commits pequeños**
   ```bash
   pnpm dev
   git add .
   git commit -m "feat(fe): login básico con validación"
   ```
   Recomendación: ejecuta localmente `pnpm lint && pnpm test && pnpm build` antes de subir.

3. **Mantenerse al día con `main`**
   ```bash
   git fetch origin
   git rebase origin/main     # o merge si el equipo lo prefiere
   # si hay conflictos → edita, prueba, git add . && git rebase --continue
   ```

4. **Publicar rama y abrir PR**
   ```bash
   git push -u origin feat/fe-login
   ```
   Crea el PR (puede ser **Draft** si falta trabajo). La CI se ejecutará en el PR:
   - `pnpm lint`
   - `pnpm test`
   - `pnpm build`

5. **Revisión, CI verde y merge**
   - Revisión: 1–2 aprobaciones.
   - **Squash & Merge** a `main`.
   - **Protecciones recomendadas**: PR obligatorio, CI verde, bloquear push directo a `main`.

6. **Limpiar ramas**
   - Borra la rama en remoto desde el PR (botón “Delete branch”).
   - En local:
     ```bash
     git switch main
     git pull --rebase
     git branch -d feat/fe-login
     git fetch --prune          # limpia referencias remotas antiguas
     ```

---

## Convención de commits

Usamos **Conventional Commits**:

Tipos comunes: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`  
Scopes opcionales: `feat(fe): ...`, `fix(be): ...`

Ejemplos:
```
feat(fe): página de login
fix(be): evitar 500 en perfil vacío
chore(ci): actualizar Node a 22.14
```

---

## Nombres de rama sugeridos

- **Frontend**: `feat/fe-*`, `fix/fe-*`
- **Backend**: `feat/be-*`, `fix/be-*`
- **Full-stack**: `feat/full-*`
- **Urgencias**: `hotfix/*`

---

## Tips y situaciones comunes

- **Tengo cambios a medio hacer pero necesito actualizarme**
  ```bash
  git stash push -um "WIP breve"
  git pull --rebase
  git stash pop
  ```

- **Subí un archivo que debía ignorarse (p. ej., .env, build)**
  ```bash
  # agrégalo a .gitignore y luego:
  git rm --cached path/al/archivo
  git commit -m "chore: dejar de trackear archivo generado"
  ```

- **Tras rebase, subir cambios correctamente**
  ```bash
  git push --force-with-lease
  ```

- **Abortar un rebase problemático**
  ```bash
  git rebase --abort
  ```

- **Puertos ocupados**
  - Cambia `PORT` (backend) o `server.port` (Vite) en el frontend.

---

## Generadores (Nest)

Ejecuta la CLI desde el paquete backend con pnpm:

```bash
pnpm --filter @the-winner-app/backend exec nest g resource users
pnpm --filter @the-winner-app/backend exec nest g module users
pnpm --filter @the-winner-app/backend exec nest g controller users
pnpm --filter @the-winner-app/backend exec nest g service users
```

---

## Código de conducta

Sé respetuoso y colaborativo. Revisa PRs con empatía y ofrece feedback concreto, específico y accionable.

---

## Dónde hacer preguntas

Usa Issues o el canal del equipo. Incluye contexto, pasos para reproducir y logs cuando aplique.
