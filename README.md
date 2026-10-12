# CSCE 490 Research Milestone

A small, local Next.js application for previewing a personal credit-card wallet. This checkpoint uses temporary mock data only; no accounts or cards are saved.

## Requirements

- Node.js 20.9 or later
- npm

## Run locally

1. Install packages: `npm install`.
2. Create a Clerk application at [Clerk Dashboard](https://dashboard.clerk.com).
3. Copy `.env.example` to `.env.local`, then replace the two placeholder API-key values with the development keys from Clerk:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — the Publishable key (`pk_test_...`)
   - `CLERK_SECRET_KEY` — the Secret key (`sk_test_...`)
4. Start the development server: `npm run dev`.
5. Open [http://localhost:3000](http://localhost:3000), create an account, and sign in.

New sign-ins and sign-ups are redirected to `/wallet`.

## Supabase and Prisma setup

1. Create a Supabase project and open **Connect** in its dashboard.
2. Copy the Supavisor **Transaction pooler** connection string (port `6543`) into `DATABASE_URL` in your ignored `.env.local` file. Add `?pgbouncer=true` if it is not already present.
3. Copy the Supavisor **Session pooler** connection string (port `5432`) into `DIRECT_URL` in `.env.local`.
4. Generate Prisma Client after both variables are set:

   ```bash
   npx prisma generate
   ```

5. Create the first migration only after reviewing the schema and confirming the target database:

   ```bash
   npx prisma migrate dev --name init
   ```

`DATABASE_URL` is used by the app at runtime. `DIRECT_URL` is used by Prisma CLI commands such as migrations. Do not commit `.env.local`, run migrations against a database you do not intend to change, or use `prisma db push` for this project.

## Checks

Run `npm run lint` and `npm run build`.

## Current scope

This checkpoint includes Clerk sign-up, sign-in, sign-out through the user menu, a protected `/wallet` route, and Prisma configuration for a future Supabase PostgreSQL database. The wallet still uses temporary mock card data; no database migration or CRUD persistence has been implemented yet.
