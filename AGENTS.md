# AGENTS.md — EmailSign (formerly MySigMail)

> Self-hosted fork of [antonreshetov/mysigmail](https://github.com/antonreshetov/mysigmail).
> Maintained by Ruthvik Upputuri. Branch: `test` (will be merged to `main` after validation).

This file is the single source of truth for AI coding agents. Read it completely before making any change. Prefer small, focused diffs. Never invent requirements.

---

## 1. Project Overview

**EmailSign** is a free, open-source, self-hostable email signature generator for Gmail, Outlook, Apple Mail, etc.

Core principles of the product:
- Completely client-side signature editor + HTML rendering (SPA).
- Optional Node.js/Express backend only for:
  - Authentication (single-admin, Argon2)
  - Image upload to pluggable storage providers (or Base64 fallback)
- Docker-first deployment with Traefik / Caddy / Nginx support.
- Multi-package-manager friendly (`npm`, `pnpm`, `yarn`, `bun`). **All changes must be compatible across these package managers.**

License: AGPL-3.0 (upstream + all fork changes).

---

## 2. Tech Stack (exact versions matter)

| Layer            | Technology                                           | Notes                           |
| ---------------- | ---------------------------------------------------- | ------------------------------- |
| Frontend         | Vue 3.5 + TypeScript 5.8                             | Composition API only            |
| Build            | Vite 7 + `@tailwindcss/vite` 4                       | Tailwind CSS v4                 |
| UI Components    | shadcn-vue (reka-ui) + lucide-vue-next               | Auto-imported                   |
| State            | VueUse (`useStorage`) + local composables            | No Pinia / Vuex                 |
| Routing          | Vue Router 4                                         | Client-side auth guard          |
| Backend          | Express 5 + Argon2 + Multer + Session                | Only when auth or upload needed |
| Storage          | Pluggable: R2 / S3 / Supabase / Custom HTTP / Base64 | See `server/storage.js`         |
| Testing          | Vitest (unit) + Playwright (e2e)                     | Strict requirement              |
| Linting / Format | ESLint (`@antfu/eslint-config`) + Prettier           | Conventional commits            |
| Package managers | npm / pnpm / yarn / bun                              | Universal compatibility needed  |

Node.js ≥ 20 required.

---

## 3. Repository Structure (every important path explained)

```
.
├── src/ # Frontend (Vue 3 SPA)
│ ├── components/
│ │ ├── addons/ # Banner, CTA, Disclaimer, Logo, MobileApp, VideoConference
│ │ ├── basic/ # Avatar, Name, Job, Company, Website, Email, Phone fields
│ │ ├── header/ # Top navigation / branding
│ │ ├── layouts/ # App layout wrappers
│ │ ├── options/ # Font, colors, avatar shape/size, separators
│ │ ├── preview/ # Live HTML signature preview + copy button
│ │ ├── sidebar/ # Navigation between Basic / Social / Options / Addons / Templates
│ │ ├── social/ # Social icon links
│ │ ├── templates/ # Template cards (SignatureTemplate1–9)
│ │ └── ui/ # shadcn-vue primitives (Button, Input, Select, etc.)
│ ├── composables/
│ │ ├── signatures/
│ │ │ ├── types/index.ts # ★ Core TypeScript types (Signature, Addon, BasicTool, OptionsTool…)
│ │ │ └── useSignatures.ts # ★ Central state + business logic for the current signature
│ │ ├── useCopySignature.ts # Clipboard + HTML generation helpers
│ │ └── useSonner.ts # Toast notifications
│ ├── data/
│ │ ├── templates.ts # ★ Default templates + DEFAULTS object
│ │ ├── addons.ts, socials.ts, attributes.ts, presets.ts, disclaimer-pressets.ts, analytics.ts
│ ├── lib/utils.ts # cn() helper (clsx + tailwind-merge)
│ ├── router/index.ts # Routes + auth guard that calls /api/auth/status
│ ├── utils/index.ts # clone() and other pure helpers
│ ├── views/ # Page-level components (Basic, Social, Options, Addons, Templates, Faq, Login)
│ ├── App.vue # Root + Toaster + init()
│ ├── main.ts
│ └── style.css # Tailwind entry
├── server/
│ ├── index.js # Express app: auth (session + Argon2), /api/upload, static serving of dist/
│ └── storage.js # ★ Pluggable upload logic (R2 → S3 → Supabase → Custom → Base64)
├── docker/ # Multi-stage Dockerfiles + compose files (Traefik default, Caddy, Nginx)
├── docs/ # DOCKER.md, STORAGE.md, SECURITY.md, MIGRATION.md
├── e2e/ # Playwright config and tests
├── public/
├── .env.example # All configuration (auth + every storage provider)
├── package.json # Scripts + dependencies
├── vite.config.ts # Auto-import, Icons, Components, proxy /api → :3000
└── AGENTS.md # This file
```

**Key mental model**
- The entire signature lives in one reactive object: `installed` (from `useSignatures()`).
- Templates are just starting points that mutate `installed`.
- HTML is generated client-side from the current `installed` state.
- Backend is optional and only handles auth + image uploads.

---

## 4. Software Design & Coding Principles (must follow)

Agents **must** apply these principles on every change:

### Core Principles
1. **Single Responsibility** – One component / composable / function does one thing.
2. **Composition over Inheritance** – Prefer Vue Composition API + composables.
3. **DRY** – Extract repeated logic into composables or pure utilities.
4. **KISS / YAGNI** – Prefer the simplest solution that solves the current request. Do not add features “just in case”.
5. **Immutability where sensible** – Prefer `clone()` + new objects over deep mutation when creating templates or exporting.
6. **Type Safety First** – Never use `any` unless unavoidable. Extend existing types in `src/composables/signatures/types/index.ts`.
7. **Separation of Concerns**
  - UI components stay presentational when possible.
  - Business logic lives in composables (`useSignatures`, etc.).
  - Data defaults live in `src/data/`.
  - Side-effects (clipboard, download, upload) live in dedicated composables.
8. **Fail Fast & Explicit Errors** – Validate inputs early; use sonner toasts for user-facing errors.
9. **Security by Default**
  - Never hard-code secrets.
  - Always use the existing Argon2 + session flow for auth.
  - Image uploads go through the backend (`/api/upload`).
  - **User Permission**: Before making architectural changes to the Backend, Storage, or Docker configs, **notify the user, explain the issue, and ask for permission to proceed**.

### Vue / Frontend Specific Rules
- Always use `<script setup lang="ts">`.
- Prefer `computed` over methods for derived state.
- Use `useStorage` (VueUse) for any persistence that must survive reloads.
- Auto-imported composables and components are already configured — do not re-import them unnecessarily.
- Tailwind only. Use `cn` from `src/lib/utils.ts`. No custom CSS unless absolutely required (put it in `style.css` or a component `<style scoped>`).

### Backend Specific Rules
- Keep `server/index.js` and `server/storage.js` as the only backend files unless a clear new concern appears.
- All new storage providers must be added inside `uploadFile()` following the existing priority order and pattern.
- Never expose credentials to the frontend.

### General Code Style
- Follow the existing Prettier + ESLint (`@antfu/eslint-config`) rules.
- **Commit Convention**: The project uses [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`).
- **No Auto-Committing**: **DO NOT** commit changes autonomously unless requested by the user.

---

## 5. How to Work on This Codebase (Agent Workflow)

1. **Understand the request** → restate it briefly.
2. **Locate the relevant files** using the structure above. Start from:
   - Types → `src/composables/signatures/types/index.ts`
   - State / logic → `src/composables/signatures/useSignatures.ts`
   - Defaults → `src/data/templates.ts` (+ other data files)
3. **Prefer extending existing abstractions** over creating new ones.
4. **Testing is Mandatory**:
   - All new non-UI logic must have unit tests (Vitest). Major UI/features must have E2E tests (Playwright).
   - Run unit tests: `npm run test:unit` (or package manager equivalent).
   - Run E2E tests: `npm run test:e2e` (or package manager equivalent).
5. **Docker / Self-Hosting Integrity**:
   - If you modify the build process or environment variables, you **must** update the `Dockerfile` and `docker-compose` files in `docker/`, and document changes in `docs/`.
   - Cross-check interactions between frontend uploads and `server/storage.js`.

---

## 6. Adding New Features — Decision Guide

| Want to add…         | Where to put it                                              | Notes                             |
| -------------------- | ------------------------------------------------------------ | --------------------------------- |
| New basic field      | `BasicTool` type + `src/data/templates.ts` + UI              | Keep `main: true/false`           |
| New addon            | `Addon` union + `AddonValue` + component in `addons/` + data | Follow existing pattern           |
| New template         | New entry in `templates.ts` + component in `templates/`      | Name must be `SignatureTemplateN` |
| New storage provider | `server/storage.js` (follow priority order)                  | Document in `docs/STORAGE.md`     |
| Auth-related change  | `server/index.js` + router guard                             | Keep Argon2 + session             |
| New UI primitive     | `src/components/ui/` (shadcn style)                          | Use `pnpm dlx shadcn-vue add`     |

---

## 7. Things Agents Must Never Do

- Introduce Pinia, Vuex, Redux, or any global store (we use composables + VueUse).
- Add new heavy dependencies without explicit approval.
- Put business logic inside Vue SFCs when a composable already exists.
- Break the client-side-first architecture (signatures must still work without a backend).
- Change the AGPL-3.0 license or remove attribution.
- Commit changes autonomously unless instructed by the user.

---

**Remember**: The goal is a clean, maintainable, self-hostable email signature generator. Prefer clarity and consistency with the existing codebase over cleverness. When in doubt, ask the human before making large changes.
