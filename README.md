# Local Beef Club

Vidalia / South Georgia farm-to-table beef drops.

Know your farmer. Know your food. Inspected processing. Pickup or hold at the processor.

This is the paid marketplace. **Plenty** is the pantry. Do not fold them together.

## Live intent

Host: `https://beef.unitedundergod.org` (Vercel project `local-beef-club`, git-linked to `main`; CNAME in Cloudflare).
The `*.vercel.app` addresses sit behind Vercel login; the custom domain is the public door.

## First partners to confirm

- Semiema Farms — Swainsboro area
- McLemore’s Abattoir — Vidalia, GA

Do not publish raising claims or processor prices as fact until those conversations are written down.

## What version 1 does

- Paths for family, ground-only, steaks, gifts, restaurants, venues
- Beef drops, plus pork, chicken, and lamb interest lists (no prices until a farm signs on)
- Filters on meat, box type, and audience
- Scheduled drop with deadline + estimated pickup date, live fill meter from real reservations
- Reserve form saved to the shared database, with an emailed confirmation (no card charge)
- `/sell`: farmers and ranchers tell us what they raise; lands on the desk
- Standing order flag
- Processor pickup / hold / short local run
- Operator desk (`/desk`, password) with per-animal math, every reservation and farm, status and notes

## Data

Shared Life Produces Life Supabase, `lbc_*` tables. See `db/migrations/20261119_lbc_core.sql`.
The app holds only the publishable key: tables have RLS on and no grants, and everything goes through
`lbc_*` SECURITY DEFINER functions. Desk sessions are tokens minted against a bcrypt password hash;
change the password from the desk.

Env on Vercel: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `RESEND_API_KEY` (send-only, emails.unitedundergod.org),
`RESEND_FROM`, `APP_PUBLIC_URL`. Optional `LBC_ALERT_EMAILS` (comma-separated) to get an email for every
new reservation and farm sign-up.

## Running a drop

Drops, farms, processors, and products live in `src/lib/catalog.ts`. To open a pork, chicken, or lamb drop,
add a `Drop` with that `species`; the order form offers it automatically and the interest list stays for later buyers.

## What is not live yet

Card charges (deposits need a Stripe decision). Real inventory against a hanging carcass. Confirmed farm practices and processor prices.
