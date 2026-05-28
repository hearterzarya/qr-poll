# PoleSafe QR

**Every Highway Pole Becomes an Emergency Help Point**

Production-ready MVP for QR-based highway emergency and infrastructure reporting.

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4 + shadcn-style UI components
- Prisma ORM + PostgreSQL
- JWT authentication (jose) + bcrypt
- Framer Motion (emergency flow)
- QR code generation (qrcode)

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and set:

- `DATABASE_URL` — PostgreSQL connection string ([Neon](https://neon.tech), Railway, or local Postgres)
- `JWT_SECRET` — long random secret for admin sessions
- `NEXT_PUBLIC_APP_URL` — e.g. `http://localhost:3000`

### 3. Database setup

```bash
npx prisma migrate dev --name init
npm run db:seed
```

Or without migrations:

```bash
npm run db:push
npm run db:seed
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin Login

| Field    | Value              |
|----------|--------------------|
| Email    | `admin@polesafe.in` |
| Password | `Admin@12345`       |

Contractor demo: `contractor@polesafe.in` / `Contractor@123`

## Main Routes

### Public (Citizens)

| Route | Description |
|-------|-------------|
| `/p/{poleCode}` | QR landing page |
| `/p/{poleCode}/emergency` | 1-tap emergency report |
| `/p/{poleCode}/report` | Complaint form |
| `/track/{reportCode}` | Public status tracking |

### Admin

| Route | Description |
|-------|-------------|
| `/admin/login` | Control room login |
| `/admin/dashboard` | Stats & overview |
| `/admin/reports` | Reports table & filters |
| `/admin/reports/{id}` | Report detail & actions |
| `/admin/poles` | Pole list |
| `/admin/poles/new` | Create pole |
| `/admin/poles/{id}` | Pole detail + QR plate |
| `/admin/users` | User management (Super Admin) |

## Demo Pole

Try: [http://localhost:3000/p/NH44-UP-AGRA-0001](http://localhost:3000/p/NH44-UP-AGRA-0001)

## QR Code Generation

1. Log in to admin → **Poles & QR**
2. Open a pole → view printable **Highway Help Point** plate
3. Download PNG/SVG or print directly

QR URL format: `{NEXT_PUBLIC_APP_URL}/p/{poleCode}`

Example production URL: `https://app.polesafe.in/p/NH44-UP-AGRA-0231`

## API Overview

**Public:** `GET /api/poles/:poleCode`, `POST /api/reports`, `POST /api/uploads`, `GET /api/reports/track/:reportCode`, `POST /api/qr-scan`

**Admin:** `/api/auth/*`, `/api/admin/stats`, `/api/admin/reports/*`, `/api/admin/poles/*`, `/api/admin/users/*`

## Deploy

### Vercel

1. Push to GitHub
2. Import in Vercel
3. Add env vars: `DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_APP_URL`
4. Build command: `prisma generate && next build`
5. Run migrations against production DB: `npx prisma migrate deploy`
6. Seed once: `npm run db:seed`

### Railway

1. Create PostgreSQL + Web Service
2. Set same environment variables
3. Deploy from repo; run `prisma migrate deploy` and seed via Railway shell

## Project Structure

```
src/
  app/           # Pages & API routes
  components/    # UI, public, admin, forms
  lib/           # Auth, prisma, priority, notifications, uploads, qr
  hooks/
prisma/
  schema.prisma
  seed.ts
```

## License

Proprietary — PoleSafe QR MVP
