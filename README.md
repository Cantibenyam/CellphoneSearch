# Mobile Phones Market Comparison Platform

CSE 412 Database Management — Phase 3 — Group 37
Spring 2026, Arizona State University

A Next.js + PostgreSQL web application that lets registered users search phone
models, compare listings from third-party sellers, favorite listings, and manage
their profile.

## Tech stack

- **Frontend / Backend:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL 17
- **DB driver:** `pg` (node-postgres) — raw parameterized SQL, no ORM
- **Auth:** `bcryptjs` (cost 10) + `iron-session` (encrypted session cookies)
- **Validation:** `zod`

## Repository layout

```
Phase3CSE412/
├── db/
│   ├── schema.sql              5-table DDL
│   └── seed/                   CSV seed files (20 sellers, 50 users, 930
│                               models, 1883 listings, 320 favorites)
├── web/                        Next.js application
│   ├── scripts/reseed.ts       Drop, recreate, COPY, bcrypt-rehash
│   ├── src/lib/db.ts           pg.Pool singleton
│   ├── src/lib/queries/        All SQL lives here (one file per entity)
│   ├── src/lib/auth.ts         hashPassword, verifyPassword, requireUser
│   ├── src/lib/session.ts      iron-session config
│   ├── src/lib/validation.ts   zod schemas
│   ├── src/app/api/            Route handlers (POST/PATCH/DELETE)
│   └── src/app/                Pages (server components fetch from queries/)
├── SPEC.md                     Project specification
├── PLAN.md                     Implementation plan
└── 37.pdf                      Application Manual (final deliverable)
```

## Setup

### 1. Prerequisites

- Node.js 20+ and npm 10+
- PostgreSQL 17 with a database named `CSE412Proj` owned by user `postgres`

### 2. Configure environment

```bash
cd web
cp .env.example .env.local
# Edit .env.local: set DATABASE_URL password to match your local Postgres
```

`.env.local` contents:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/CSE412Proj
SESSION_PASSWORD=replace-with-32-or-more-random-characters
```

### 3. Install dependencies

```bash
cd web
npm install
```

### 4. Reseed the database

This drops the 5 tables, recreates the schema from `db/schema.sql`, INSERTs all
CSV rows in FK-correct order, and bcrypt-rehashes every seeded user's password
to the demo value `password123` so any seeded user can log in.

```bash
cd web
npm run db:reseed
```

Expected output:

```
✓ seller: 20 rows
✓ app_user: 50 rows
✓ model: 930 rows
✓ listing: 1883 rows
✓ favorite: 320 rows
→ Rehashing seeded user passwords to "password123"...
✓ rehashed 50 user passwords
```

### 5. Start the dev server

```bash
cd web
npm run dev
```

Open http://localhost:3000.

## Demo credentials

- **Seeded user:** `nancy.garcia@example.com` / `password123`
- **New signups:** any unused email + 8+ char password

(Any seeded user works with `password123` after running `db:reseed` — see
`db/seed/app_user.csv` for the full list.)

## Feature walkthrough (CRUD coverage)

| CRUD | Operation | Table | Where in UI |
|------|-----------|-------|-------------|
| Create | Sign up new user | `app_user` | `/signup` |
| Create | Add favorite | `favorite` | Heart button on `/listings/[id]` |
| Create | Add listing | `listing` | Form on `/admin/listings` |
| Read | Search models by name/brand | `model` | `/` and `/models?q=...` |
| Read | View listings for a model | `model` ⨝ `listing` ⨝ `seller` | `/models/[id]` |
| Read | View listing detail | `listing` ⨝ `model` ⨝ `seller` | `/listings/[id]` |
| Read | View favorites | 4-table JOIN | `/favorites` |
| Update | Change name or password | `app_user` | `/profile` |
| Update | Change listing price | `listing` | `/admin/listings` |
| Delete | Remove favorite | `favorite` | Heart toggle |
| Delete | Delete listing | `listing` | `/admin/listings` |

## Scripts

```bash
npm run dev         # Start dev server at http://localhost:3000 (webpack, not Turbopack)
npm run build       # Production build (webpack)
npm start           # Start production server
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run db:reseed   # Drop, recreate, seed, bcrypt-rehash
```

## Security notes

- All values entering SQL go through `$1, $2, ...` parameterized placeholders.
  No string concatenation of user input. (Verifiable: `grep -rE "INSERT INTO|SELECT |UPDATE |DELETE " web/src/app/api/` returns zero matches because all SQL lives in `web/src/lib/queries/`.)
- Passwords are bcrypt-hashed at cost 10 before INSERT or UPDATE.
- Session cookies are HTTP-only, `SameSite=Lax`, and encrypted with iron-session
  using a 32+ char `SESSION_PASSWORD`.
- All request bodies are validated with `zod` before they reach the database
  layer.

## Team

- **Duisebayev Imangali** — Implementation
- **Daniel Brown**
- **Megan Brown**
- **Sai Aishwarya Reddy Devarapalli**

See `37.pdf` for full team contributions.

## Links

- Video demonstration: _(added to 37.pdf at submission time)_
- GitHub repository: _(added to 37.pdf at submission time)_
