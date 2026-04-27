# Mobile Phones Market Comparison Platform

Web app for searching phone models and comparing listings from third-party sellers, with user accounts and a favorites list.

## Tech stack

- **Next.js 16** (App Router) + **TypeScript**
- **React 19** + **Tailwind CSS v4**
- **PostgreSQL 17** with `pg` (raw parameterized SQL, no ORM)
- **bcryptjs** for password hashing
- **iron-session** for cookie-based sessions
- **zod** for input validation

## Setup

### 1. Prerequisites

- Node.js 20+ and npm 10+
- PostgreSQL 17, with an empty database you have created (any name) and a user with permission to drop/create tables in it

### 2. Configure environment

```bash
cd web
cp .env.example .env.local
```

Edit `.env.local` with your own connection details:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
SESSION_PASSWORD=replace-with-32-or-more-random-characters
```

The reseed script reads `DATABASE_URL` and applies the schema to whatever database that URL points at, so name/user/host are entirely your choice.

### 3. Install + seed + run

```bash
cd web
npm install
npm run db:reseed   # drop tables, reload from db/seed/*.csv, bcrypt-rehash users
npm run dev         # http://localhost:3000
```

Expected reseed output:

```
seller    20
app_user  50
model     930
listing   1883
favorite  320
```

## Login

Any seeded user works after `db:reseed`. Demo credential:

```
nancy.garcia@example.com / password123
```

Or sign up at `/signup`.

## Scripts

```
npm run dev         Start dev server (webpack)
npm run build       Production build
npm start           Start production server
npm run typecheck   tsc --noEmit
npm run lint        eslint
npm run db:reseed   Drop, recreate, seed, bcrypt-rehash
```

## Layout

```
db/
  schema.sql        5-table DDL
  seed/             CSV seed files
web/
  scripts/reseed.ts Drop + recreate + COPY + bcrypt-rehash
  src/lib/db.ts     pg.Pool singleton
  src/lib/queries/  All SQL lives here (one file per entity)
  src/lib/auth.ts   bcrypt + session helpers
  src/app/api/      Route handlers
  src/app/          Pages
```
