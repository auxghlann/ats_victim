# Changelog

All notable changes to this project are documented in this file.

## [v1.0.1] - 2026-11-15

### Bug Fixes
* Pin `jose` to `4.15.9` in `pnpm-workspace.yaml` so `firebase-admin/auth` and `jwks-rsa` load without `ERR_REQUIRE_ESM` under `pnpm` (`179b45a`)
* Sanitize frontend and `/api/auth/session` error messages via `getAuthErrorMessage` (`src/lib/firebase/authErrors.ts`) and remove raw SDK/env error exposure in `LoginPage` and `AddApplicationModal` (`179b45a`)
* Add App Router error boundary (`src/app/error.tsx`) with non-sensitive fallback UI (`179b45a`)

## [v1.0.0] - 2026-11-15

### Features
* Implement dashboard KPIs, tasks manager, interviews calendar, and modular application tracker (`439e0fa`, `2dc8699`)
* Implement Firebase Google SSO authentication, HTTP-only `__session` cookie verification, and scenic login flow (`4fdbf69`, `bbba669`)
* Implement AES-256-GCM field-level encryption at rest for user PII and multi-tenant ownership enforcement (`bbba669`, `54b0089`)
* Add standalone `/tracker/[id]` job details view with markdown job descriptions, notes CRUD, linked tasks, and status timeline (`2dc8699`, `95d81c0`, `2a24299`)
* Add portal-mounted floating dropdowns, universal delete confirmation modal, posting URL editing, and scrollable legal modals (`af4511c`, `56f56e2`, `8fb3517`)
* Add production security headers (CSP, HSTS, X-Frame-Options) and custom 403/404 standalone error pages (`c9f8682`, `54b0089`)

### Bug Fixes
* Fix interview calendar defaulting to first scheduled interview instead of current local month/today and fix UTC vs local `todayStr` highlight in `CalendarGrid` (`2a24299`, `85142f5`)
* Resolve mobile layout overflows, responsive typography, job header spacing, and weekly activity chart margins (`a840fe6`, `8791358`)
* Enforce strict session authentication across `src/proxy.ts`, `/tasks`, and `/interviews` (`c9f8682`, `85142f5`)
* Harden CSV export cell escaping against formula injection (`CWE-1236`) and upgrade Next.js to `16.4.6` (`85142f5`)
* Override `jose` to `4.15.9` for `jwks-rsa` CommonJS compatibility on Vercel (`0030bde`)

### Refactoring
* Consolidate application, task, and interview create/edit modals and remove redundant in-memory server TTL cache (`85142f5`)
* Hoist persistent root layout shell with in-memory navigation state (`329d208`)

### Docs & Chores
* Configure unit, integration, and Playwright E2E test suites (`node:test`, `tsx`, `@playwright/test`) and migrate lockfile to `pnpm-lock.yaml` (`85142f5`)
