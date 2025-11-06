# Basalam Image Editor (Darkube-style Clone)

Recreates `https://editor.darkube.app/` UI/flows, powered by Basalam APIs.

## Stack
- Next.js + TypeScript + Tailwind + shadcn/ui
- API routes for Basalam proxy and image pipeline
- SQLite/Postgres via Prisma

## Setup
1. Copy env:

```bash
cp .env.example .env
```

2. Fill environment variables:
- `BASALAM_CLIENT_ID`, `BASALAM_CLIENT_SECRET` (for OAuth) or `BASALAM_PAT`
- `BASALAM_API_BASE=https://openapi.basalam.com`

3. Install and run:

```bash
pnpm install
pnpm dev
```

If you lack `pnpm`, use Corepack or `npm`/`yarn`.

## Docs
- Spec: `docs/spec.md`
- Quick Start (Basalam): https://developers.basalam.com/docs/quick-start
- SDK Core (Python reference): https://developers.basalam.com/docs/sdk/python/core
- MCP Guide: https://developers.basalam.com/docs/mcp


