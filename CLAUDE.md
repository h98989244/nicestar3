# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language

Always respond in 繁體中文 (Traditional Chinese), including plans, tasks, and walkthroughs.

## Project Overview

NICE-DA Technology (奈斯達科技) e-commerce site for 3C products and smart wearable accessories. React 19 + Vite 6 + TypeScript frontend targeting Taiwan market.

## Commands

- **Install dependencies**: `pnpm install`
- **Dev server**: `pnpm dev` (port 3000, host 0.0.0.0)
- **Build**: `pnpm run build`
- **Type check / lint**: `pnpm run lint` (runs `tsc --noEmit`)
- **Preview production build**: `pnpm run preview`
- **Clean**: `pnpm run clean`

Note: `package.json` scripts use npm-style commands but **pnpm is the package manager** (required for Amplify deployment).

## Architecture

**Single-page app** using React Router v7 with a shared `Layout` component wrapping all routes via `<Outlet />`.

- `src/main.tsx` — App entry point
- `src/App.tsx` — Route definitions (BrowserRouter)
- `src/components/Layout.tsx` — Shared header/footer/navigation
- `src/pages/` — One component per route (Home, Products, ProductDetail, Checkout, Login, About, Contact, FAQ, Terms, Privacy)

**Styling**: Tailwind CSS v4 via Vite plugin (`@tailwindcss/vite`). Utility-first classes directly in JSX. Color scheme uses dark blues (#1a2332 primary).

**Icons**: Lucide React. **Animations**: Motion library.

**Path alias**: `@/*` resolves to project root (configured in both `vite.config.ts` and `tsconfig.json`).

## Code Style

- TypeScript strict mode
- Single quotes, no semicolons
- Functional components with hooks (no class components)
- SSR-compatible code required (deployment target is AWS Amplify)

## Deployment

- **Target**: AWS Amplify (region `ap-southeast-1`)
- **Config**: `amplify.yml` — uses pnpm, outputs to `dist`
- **Env var updates**: Run `scripts/update-amplify-env.ps1` after changing environment variables
- **AWS interactions**: Use AWS CLI

## Backend / Integrations

- **Supabase**: Database and auth (env vars in `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- **Google GenAI**: AI features via `@google/genai` (API key passed through Vite `define`)
- **Express + better-sqlite3**: Available as dependencies but not the primary runtime

## Environment Notes

- Development environment is Windows (PowerShell) — most Unix commands unavailable (no `cat`)
- HMR can be disabled via `DISABLE_HMR=true` env var (for AI Studio compatibility)
