# Admin sign-in setup

The admin authorization endpoint is a Vercel serverless function at `/api/user/isAdmin`. It uses `@supabase/server` to validate the incoming Supabase bearer token, then compares the verified account email with the server-only `ADMIN_EMAILS` allowlist. It does not trust editable user metadata. The server runtime must be Node.js 22 or newer.

## Vercel setup

In the Vercel project settings, set **Root Directory** to the repository root (the folder containing both `api/` and `Frontend/`). Add these environment variables for Production and Preview as needed:

| Variable | Value |
| --- | --- |
| `SUPABASE_URL` | The Supabase project URL, such as `https://<project-ref>.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | The Supabase publishable key (legacy anon key also works) |
| `SUPABASE_SECRET_KEY` | Supabase secret key, server-side only; copy it directly from Supabase API Keys settings into Vercel |
| `SUPABASE_JWKS_URL` | `https://<project-ref>.supabase.co/auth/v1/.well-known/jwks.json` |
| `ADMIN_EMAILS` | Comma-separated sign-in email(s) allowed into the admin dashboard |
| `VITE_SUPABASE_URL` | Same Supabase project URL, for the browser client |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Same publishable key, for the browser client |
| `VITE_SITE_URL` | Stable production site origin, e.g. `https://gdg-qu-website.vercel.app` |

Do not set a secret key in a `VITE_*` variable, commit it, or paste it into chat. The value pasted in the chat was masked, so enter the complete key directly in Vercel. `ADMIN_EMAILS` is server-only and must not use the `VITE_` prefix. The server auth package uses the secret key only on the server; it does not need to be shared with the browser.

## Supabase redirect setup

In **Authentication → URL Configuration**:

- Set **Site URL** to the stable production origin.
- Add `https://<your-production-domain>/auth/callback` to Redirect URLs.
- Add `http://localhost:5173/auth/callback` for local frontend sign-in.

The Google and GitHub provider callback URI remains the Supabase callback URL displayed in each provider's Supabase settings. It is different from the `/auth/callback` app URL above.

## Deploy and use

Save the Vercel environment settings and redeploy. Sign in using an email listed in `ADMIN_EMAILS`; the post-login callback sends that account to `/admin`. Other signed-in users go to `/profile`. `/admin` calls the authorization endpoint again before rendering the dashboard.

For local end-to-end use, install/link the Vercel CLI to this project and run `vercel dev` from the repository root so `/api/user/isAdmin` is available alongside the frontend. Configure the same variables in the linked Vercel project or local Vercel environment.

## Existing admin data APIs

This repository previously had no backend. This addition implements admin identity verification and post-login routing only. The dashboard's event, team, and contact CRUD screens still call the separate APIs configured by `VITE_BACKEND_URL`; those endpoints must be deployed and configured for those data operations to work.
