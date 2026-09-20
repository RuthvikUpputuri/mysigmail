# AI Agents Guide & Instructions

Welcome AI Agents! This document provides detailed information about the `mysigmail` codebase, its structure, and the software design/coding principles you must follow when contributing to this project.

The goal of this repository is to provide an open-source email signature generator for Gmail, Outlook, Apple Mail, etc., making it easy to self-host and eventually allowing open-source contributions.

## 1. Project Overview & Tech Stack
- **Framework**: Vue 3 (using the Composition API and `<script setup>` syntax)
- **Bundler**: Vite
- **Package Manager**: Bun (you must use `bun run` or `bun install`)
- **Styling**: Tailwind CSS (v4) with utility-first approach
- **UI Components**: Shadcn Vue (styled with Tailwind and `lucide-vue-next` for icons)
- **Routing**: Vue Router 4
- **Utilities**:
  - `@vueuse/core` (Composition utilities)
  - `vee-validate` (Form validation)
  - `vuedraggable` (Drag and drop)
  - `cropperjs` (Image cropping)
- **Code Quality**: ESLint, Prettier, TypeScript, Lint-staged, and Commitlint.

## 2. Codebase Structure

Understanding the structure is key to knowing where to make changes:

- `src/main.ts`: Application entry point. Mounts the Vue app and registers plugins (like Router).
- `src/App.vue`: The root component for the application.
- `src/router/index.ts`: Vue Router configuration. Handles navigation between views.
- `src/views/`: Contains main page components (e.g., `Basic.vue`, `Social.vue`, `Options.vue`, `Addons.vue`, `Templates.vue`).
- `src/components/`: Reusable UI components.
  - `src/components/ui/`: Contains Shadcn Vue primitives (e.g., buttons, dialogs, inputs).
  - Other subdirectories (`addons`, `basic`, `header`, `layouts`, `sidebar`, `social`, `templates`, `options`) contain feature-specific components.
- `src/composables/`: Reusable logic extracted into Vue composables (e.g., `useSignatures.ts` handles the state and logic for signatures, `useSonner.ts` for toast notifications).
- `src/data/`: Static configuration data (e.g., lists of available `templates`, `addons`, `socials`, `analytics`).
- `src/lib/`: Common library utilities (e.g., `utils.ts` for tailwind class merging `cn`).
- `src/utils/`: General helper utilities (e.g., deep cloning).
- `public/`: Static assets served directly (images, favicons).
- Configuration files (`vite.config.ts`, `tailwind.config`, `tsconfig.*`, `eslint.config.js`, `components.json`) sit at the root level and manage the build process, linting, formatting, and UI component paths.

## 3. Software Design & Coding Principles

When writing or modifying code in this repository, you must adhere to the following principles:

### a) Single Responsibility Principle (SRP)
Components, composables, and utility functions should do one thing and do it well. Break down complex Vue components into smaller, focused child components.

### b) DRY (Don't Repeat Yourself)
Avoid duplicating code. If you find yourself writing the same logic or UI pattern twice, extract it into a utility function, a composable (`src/composables`), or a reusable component (`src/components`).

### c) Vue 3 Best Practices
- **Composition API**: Exclusively use `<script setup>` syntax for all components.
- **Reactivity**: Use `ref` for primitive values and `reactive` for complex objects only when necessary. Prefer `computed` properties for derived state.
- **Lifecycle hooks**: Use `onMounted`, `watch`, and `watchEffect` appropriately without causing infinite render loops.
- **Props and Emits**: Strictly type your props using `defineProps<{ ... }>()` and emits using `defineEmits<{ ... }>()`.

### d) Styling
- Strictly use **Tailwind CSS** utility classes for styling. Avoid writing custom CSS in `<style>` blocks unless absolutely necessary.
- When applying conditional classes, use the `cn` utility function (from `src/lib/utils.ts`) to merge Tailwind classes efficiently and avoid conflicts.

### e) TypeScript & Type Safety
- The project relies heavily on TypeScript. **Do not use `any`**. Always define proper interfaces or types for your data structures (e.g., in `src/composables/signatures/types/`).
- Validate external data inputs correctly.

### f) Component Library (Shadcn Vue)
- This project uses Shadcn Vue. If you need a standard UI element (like a Dialog, Select, or Button), check `src/components/ui` first.
- If you need a new UI component, you can use the `pnpm dlx shadcn-vue@2.0.1 add <component-name>` command (as defined in `package.json`), but prefer using Bun if executing manually.

## 4. Instructions for AI Agents

When acting upon user requests, follow this workflow:

1. **Understand First**: Read the relevant files in `src/` to trace how data flows (especially through `src/composables/signatures/useSignatures.ts`).
2. **Environment**:
   - Always install dependencies using `bun install`.
   - Run the dev server using `bun run dev`.
3. **Commit Convention**:
   - The project strictly uses [Conventional Commits](https://www.conventionalcommits.org/).
   - Format: `<type>(<optional scope>): <description>`
   - Common types:
     - `feat:` for new features (used extensively in this test branch).
     - `fix:` for bug fixes.
     - `docs:` for documentation.
     - `chore:` for updating tooling, configs, etc.
   - Example: `feat(signatures): add background color customization`
4. **Testing & Verification**:
   - Always verify that your changes compile without errors (`bun run build` or `bun run lint`).
   - If writing new logic, verify it manually or add tests if a testing framework is present.
   - Ensure the UI renders correctly by checking components.
5. **Pre-commit Steps**:
   - Before submitting changes, always run the required linters and formatters as defined in the `lint` scripts (`bun run lint`).

By following these instructions and principles, you will ensure the `mysigmail` codebase remains clean, maintainable, and highly scalable for self-hosting and future open-source contributors.
