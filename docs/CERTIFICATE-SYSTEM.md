# GDG QU certificate system

## Current implementation

The certificate area is integrated into this React/Vite app at `/admin/certificates`. It uses Supabase Auth for sign-in and the existing `admin_users` allowlist for server-side authorization. It includes event and template creation, individual PDF issuance, bulk CSV/XLSX processing in retryable HTTP batches, private PDF/QR storage, certificate search and revocation, ZIP exports (25 PDFs per part), audit entries, and the public `/verify/:certificateId` page.

Binary Excel 97 `.xls` is not supported. Save it as `.xlsx` or `.csv` before upload. The XLSX reader handles the first worksheet, shared strings, and inline strings. Certificate backgrounds support PNG/JPEG up to about 2.2 MB; PDF/SVG backgrounds, custom field positioning, signatory designer, delivery email, and PNG certificate export are not included yet. Rendered certificates currently use the built-in A4 landscape layout and standard Helvetica fonts.

Bulk job creation accepts up to 5,000 rows. A processing request handles five certificates at a time; the page continues the requests while open, and the same job can be resumed after an interruption. This is resumable batch processing, not a detached queue worker. Failed rows can be retried by a certificate manager. ZIP exports are split into 25-PDF parts to control memory use.

## 1. Configure environment variables

The browser app needs only the Supabase project URL and publishable key:

- `Frontend/.env.local`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`

The Vercel project’s server environment needs:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` (server only; never use a `VITE_` name)
- `PUBLIC_SITE_URL` (the deployed site origin used in QR codes)

For local development, put the server variables in the root `.env` and the browser variables in `Frontend/.env.local`. Variable names are listed in `backend.env.sample` and `Frontend/.env.sample`; these samples intentionally contain no credentials. Restart the dev server after changing environment variables.

## 2. Apply the database and storage setup

Run [`supabase/certificate-management.sql`](../supabase/certificate-management.sql) in the Supabase Dashboard’s SQL Editor for the intended project. It creates the certificate tables, indexes, role columns, restrictive RLS/grants, the `verify_certificate` RPC, and private `certificate-files` Storage bucket. The bucket allows PDF, PNG, and JPEG files; browser roles receive no access to private files.

This repository currently contains a SQL setup script rather than a CLI-generated timestamp migration. Supabase CLI migration generation was unavailable in the implementation environment. The SQL has not been applied or verified against the live project. Review it against the project schema before applying. Do not run it against production until that review is complete.

## 3. Grant the first administrator access

Create the user in Supabase Auth and confirm the email. Add that email to the allowlist (replace the example address):

```sql
insert into public.admin_users (email)
select lower(btrim(u.email))
from auth.users as u
where lower(btrim(u.email)) = lower(btrim('admin@example.com'))
  and u.email_confirmed_at is not null
on conflict (email) do nothing;

update public.admin_users
set role = 'super_admin', is_active = true
where email = lower(btrim('admin@example.com'));
```

Open `/admin/login` and sign in with that Auth account. From **Administrators**, a super admin can assign `certificate_manager`, `event_manager`, or `viewer` roles and deactivate an allowlisted account. New administrators must first be added to `admin_users` after their confirmed Auth account exists. Event managers are scoped to linked events; certificate/event managers and super admins can manage all certificate events.

## 4. Issue and verify certificates

1. Create an event and choose its allowed categories.
2. Create a template. Optionally upload a PNG/JPEG background.
3. Use **Issue** for one recipient or **Bulk generation** for a CSV/XLSX file. Map the name and email columns, select event/template, then validate/create the job.
4. Select **Process / resume next batches**. Review invalid/duplicate/failed rows, retry failed certificates when appropriate, export IDs/verification URLs, and download the generated ZIP parts.
5. QR codes point to `/verify/GDGQU-YYYY-<random-id>`. The public page displays only recipient name, event, category, issue date, certificate ID, and active/revoked status. Active certificates receive a five-minute signed PDF URL; revoked certificates do not.

## 5. Build and tests

Run from the repository root:

```sh
npm run build
npm run test:certificates
```

The local tests cover certificate ID uniqueness/format, classification of 500 sample rows including missing fields and duplicates, quoted CSV parsing and mapping, role denial, and PDF/QR output from the renderer. They do not exercise live Supabase RLS, Storage policies, Auth, public verification, API pagination, or actual end-to-end retry behavior; those checks require applying the SQL and using a test Supabase project.

## Operational limits to address before production use

- Public verification rate limiting is per serverless instance, not shared/distributed. Put a shared rate limiter (e.g. edge/WAF or database-backed) in front before a high-traffic launch.
- Batch work is driven by the browser; keep the admin page open until processing completes, or reopen it and resume. A durable background queue/worker is needed for unattended jobs.
- Supabase SQL setup, role promotion, and an end-to-end test project remain manual. No migration or deployment is claimed as applied.
- The UI does not yet include monthly/event charts or a full visual template field/signatory editor, and certificate correction/reissuance history is not implemented.
