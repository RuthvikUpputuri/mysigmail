# AI Agent Instructions for EmailSign Codebase

Welcome to the EmailSign (formerly MySigMail) repository. This file serves as your primary guide for understanding the project structure, development guidelines, and architectural decisions. You must adhere to these instructions when proposing or implementing changes.

## 1. Project Overview

EmailSign is an open-source, multi-package manager compatible, self-hostable email signature generator. The tech stack consists of:
- **Frontend**: Vue 3 (Composition API with `<script setup>`), Vite, Tailwind CSS v4, TypeScript, and Shadcn Vue.
- **Backend/Server**: Node.js with Express.js (used for serving the app, handling authentication, and file storage bridging).
- **Tooling**: Vitest (Unit Testing), Playwright (E2E Testing), ESLint/Prettier (Linting/Formatting).

## 2. Core Directories and Critical Files

*   **`/src/`**: The frontend source code.
    *   `/src/components/`: Reusable Vue UI components (e.g., Shadcn Vue components, custom form controls, signature preview blocks).
    *   `/src/views/`: Top-level page components (e.g., the main editor interface).
    *   `/src/composables/`: Reusable composition functions (Vue 3 hooks).
    *   `/src/lib/` & `/src/utils/`: Helper functions, constants, and shared logic.
    *   `main.ts`: The Vue application entry point.
*   **`/server/`**: The Node.js Express backend.
    *   `index.js`: The main Express server entry point. Handles static file serving, authentication (using `argon2` and sessions), and routing.
    *   `storage.js`: Pluggable storage abstraction. Handles secure file uploads to various providers (S3, R2, Supabase, etc.) without exposing credentials to the client.
*   **`/docker/`**: Contains Docker-related deployment configurations.
    *   Includes `Dockerfile`, `Dockerfile.caddy`, `Dockerfile.nginx` for multi-stage production builds.
    *   Includes `docker-compose.*.yml` files for reverse-proxy setups.
*   **Root Config Files**:
    *   `package.json`: Project dependencies and scripts.
    *   `vite.config.ts`: Vite build and plugin configurations.

## 3. Package Manager Agnosticism

This project supports multiple package managers (`npm`, `pnpm`, `yarn`, `bun`).
*   **Instruction**: You must ensure that any new dependencies or script changes are compatible across all major package managers. Avoid relying on package-manager-specific features or lockfile manipulations unless absolutely necessary.
*   **Installation**: Use standard installation commands depending on the environment, but prioritize universal compatibility.

## 4. Coding Principles and Best Practices

When writing or modifying code, adhere strictly to the following industry-standard principles:

*   **SOLID Principles**: Ensure single responsibility, open/closed, Liskov substitution, interface segregation, and dependency inversion where applicable.
*   **DRY (Don't Repeat Yourself)**: Avoid duplicated logic; extract reusable components and composables.
*   **KISS (Keep It Simple, Stupid)**: Prefer straightforward, readable solutions over complex, "clever" implementations.
*   **Separation of Concerns**: Keep business logic out of UI components. Use composables for state management and logic, and components purely for presentation.

### Vue 3 & Vite Best Practices
*   Use `<script setup>` and Composition API exclusively.
*   Use TypeScript strictly. Define interfaces and types for all props, emits, and state.
*   Leverage Vue's reactivity system (`ref`, `computed`, `watch`) efficiently to avoid unnecessary re-renders.

### Tailwind CSS Best Practices
*   Use standard utility classes. Keep templates clean.
*   Extract complex, repetitive class combinations into standard CSS using `@apply` (or native CSS with Tailwind v4 features) only when absolutely necessary for maintainability.

### Express.js Best Practices
*   Implement proper error handling middleware.
*   Keep routes clean; delegate complex logic to controllers or service files (like `storage.js`).
*   Ensure secure handling of environment variables and sensitive data.

## 5. Testing Requirements

*   **Unit Testing**: Use **Vitest**. All new non-UI logic (utils, composables, server functions) must have corresponding unit tests in the `src/` or equivalent directory.
*   **E2E Testing**: Use **Playwright**. Any new major feature, user flow, or UI component must have an E2E test verifying its behavior in the `e2e/` directory.
*   **Instruction**: Always run existing tests (`bun run test:unit`, `bun run test:e2e` or their multi-package equivalents) after making changes to ensure no regressions.

## 6. Managing New Features (Backend, Storage, Docker)

The repository includes major custom additions: an Express authentication server, pluggable cloud storage (`server/storage.js`), and a comprehensive Docker-first architecture.

*   **Security First**: When touching `server/index.js` or `server/storage.js`, prioritize security. Ensure no credentials leak to the client. Verify input sanitization and secure session management.
*   **Cross-Checking**: Always cross-check codebase interactions when modifying these features. A change in the frontend upload logic heavily impacts `server/storage.js`.
*   **User Permission**: Before making any architectural changes, bug fixes, or improvements to the Backend, Storage, or Docker configurations, **you must notify the user, explain the issue/improvement, and explicitly ask for permission to proceed.**

## 7. Committing Changes

*   **No Auto-Committing**: **DO NOT** commit changes autonomously. Only commit if the user explicitly requests a commit.
*   **Conventional Commits**: When a commit is requested, you must follow the Conventional Commits specification (e.g., `feat: add new button`, `fix: resolve login bug`) as the project uses `commitlint`.
