# Admin sign-in setup

The admin authorization endpoint is a Vercel serverless function at `/api/user/isAdmin`. It uses `@supabase/server` to validate the incoming Supabase bearer token, then queries a private `public.admin_users` table for the verified email. Passwords are handled by Supabase Auth and are never stored in this table. The server runtime must be Node.js 22 or newer.

## Vercel setup

In the Vercel project settings, set **Root Directory** to the repository root (the folder containing both `api/` and `Frontend/`). Add these environment variables for Production and Preview as needed:

| Variable | Value |
| --- | --- |
| `SUPABASE_URL` | The Supabase project URL, such as `https://<project-ref>.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | The Supabase publishable key (legacy anon key also works) |
| `SUPABASE_SECRET_KEY` | Supabase secret key, server-side only; copy it directly from Supabase API Keys settings into Vercel |
| `SUPABASE_JWKS_URL` | `https://<project-ref>.supabase.co/auth/v1/.well-known/jwks.json` |
| `VITE_SUPABASE_URL` | Same Supabase project URL, for the browser client |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Same publishable key, for the browser client |

Do not set a secret key in a `VITE_*` variable, commit it, or paste it into chat. Enter the complete key directly in Vercel. The server auth package uses the secret key only on the server; it must never be shared with the browser.

## Set up admin accounts

1. Run [`supabase/admin-users.sql`](supabase/admin-users.sql) in Supabase **SQL Editor** to create the private allowlist table.
2. In **Authentication → Settings**, disable public sign-ups if users should not be able to create accounts themselves.
3. In **Authentication → Users**, create each admin user with an email and password. Disable public sign-ups if the user list should be administrator-managed only.
4. Add each admin email to the allowlist using the SQL Editor:

```sql
insert into public.admin_users (email)
values (lower('admin@example.com'));
```

The password is managed by Supabase Auth, which stores password hashes; the allowlist stores only the email. Never add plaintext passwords to SQL, code, or environment variables. The app has no public sign-up form.

## Deploy and use

Save the Vercel environment settings and redeploy. Sign in at `/login` using an account whose email is in `public.admin_users`. `/admin` checks the account against the database before rendering the dashboard. Google and GitHub sign-in have been removed from the app; you can disable those providers in Supabase as well.

For local development, copy `backend.env.sample` to `.env` in the repository root and fill in the Supabase server variables, including the secret key. The root `.env` is gitignored. Keep the browser's `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `Frontend/.env.local`. Then run `npm run dev` from the repository root; it starts the local API and Vite, and Vite proxies `/api` to the API server.

## Existing admin data APIs

This repository previously had no backend. This addition implements admin identity verification and post-login routing only. The dashboard's event, team, and contact CRUD screens still call the separate APIs configured by `VITE_BACKEND_URL`; those endpoints must be deployed and configured for those data operations to work.
