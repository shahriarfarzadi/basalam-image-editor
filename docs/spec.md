# Basalam Image Editor – Productized Clone of editor.darkube.app

## Goals
- Recreate the UX/UI and flows of `https://editor.darkube.app/`.
- Implement Basalam account connection and vendor/product management via Basalam APIs.
- Provide AI-assisted image tooling: background removal, quality enhancement, mannequin preview, add-brand-logo.
- Track user credits and show purchase history and feedback.

## Key Screens and Flows
1. Dashboard
   - Show connection status to Basalam (connected / disconnected)
   - Quick links: Process Images, Manage Credits, Vendor Info

2. Connect to Basalam
   - Auth methods: Personal Access Token (PAT) or OAuth Authorization Code
   - Persist tokens securely (server-side session + encrypted store)
   - After connect, fetch current user: GET /v1/users/me

3. Vendor Info and Products
   - Fetch vendor: GET /v1/vendors/{vendor_id}
   - List products: GET /v1/vendors/{vendor_id}/products with filters (status, stock, price)
   - Product detail: GET /v1/products/{product_id}
   - Create product: POST /v1/vendors/{vendor_id}/products
   - Update product: PATCH /v1/products/{product_id}
   - Update variation: PATCH /v1/products/{product_id}/variations/{variation_id}

4. Image Processing
   - Upload image file(s) to Basalam to obtain file IDs: POST /v1/files (form-data)
   - Local AI processing pipeline (server-side):
     - Background removal (e.g., rembg/u2net or similar)
     - Quality enhancement (e.g., Real-ESRGAN or diffusion upscaler)
     - Virtual mannequin (template overlay/compositing; MVP via configurable mask/template)
     - Add brand logo overlay (position, opacity, scale)
   - Save processed images locally and optionally upload back to Basalam via /v1/files

5. Credits and Purchase History
   - Maintain internal credits ledger (DB table: users, credits_transactions, usage_events)
   - Each processed image consumes 1 credit
   - Purchase history page (initially stub; later integrate payment provider)

6. Feedback
   - Form: type (bug/feature/improvement/general), rating, title, message
   - Store in DB table `feedback`

## API Mapping (Basalam)
- Base URL: https://openapi.basalam.com
- Current user: GET /v1/users/me
- Vendor: GET/PATCH /v1/vendors/{vendor_id}, PATCH /v1/vendors/{vendor_id}/status
- Vendor products: GET/POST /v1/vendors/{vendor_id}/products
- Product: GET/PATCH /v1/products/{product_id}
- Product variations: PATCH /v1/products/{product_id}/variations/{variation_id}
- Categories: GET /v1/categories, GET /v1/categories/{category_id}, GET /v1/categories/{category_id}/attributes
- Files: POST /v1/files (multipart/form-data)

References
- Quick Start (auth, upload, create product): https://developers.basalam.com/docs/quick-start
- Python SDK (core/products reference): https://developers.basalam.com/docs/sdk/python/core
- MCP Server guide: https://developers.basalam.com/docs/mcp

## Architecture
- Web: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui
- Server: Next.js API routes for Basalam proxy and image pipeline
- Auth: Basalam OAuth (authorization code) and PAT mode; sessions via cookies + server store
- Storage: Supabase (Postgres + Auth + Storage) for users, sessions, credits, feedback, jobs, files metadata
- Image pipeline: Node workers (sharp + optional WASM/py workers for bg removal and upscale)
- Config: .env for BASALAM_CLIENT_ID, BASALAM_CLIENT_SECRET, BASALAM_PAT, BASALAM_API_BASE, SUPABASE_URL, SUPABASE_ANON_KEY

## Data Model (initial)
- users(id, basalam_user_id, name, mobile, vendor_id, created_at)
- sessions(id, user_id, access_token, refresh_token, expires_at, created_at)
- credits_transactions(id, user_id, delta, reason, created_at)
- usage_events(id, user_id, type, units, metadata_json, created_at)
- feedback(id, user_id, type, rating, title, message, created_at)
- image_jobs(id, user_id, status, steps_json, input_file_path, output_file_path, created_at, completed_at)
- files(id, user_id, supabase_path, basalam_file_id, kind, created_at)

## MVP Scope Definition
- Connection flow (PAT form + OAuth placeholder)
- Vendor info and products list (basic filters)
- Image upload + background removal + logo overlay + download
- Credits decrement per image, credits page, and feedback form

## Non-Goals (v1)
- Full payment integration (stub UI only)
- Advanced mannequin generation (initially template-based compositing)

## Security & Compliance
- Do not expose tokens to client; all Basalam calls from server
- Validate and rate-limit uploads
- Sanitize user-provided overlays/logos


