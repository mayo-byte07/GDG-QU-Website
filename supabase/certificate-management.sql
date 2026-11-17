-- Apply in the Supabase SQL Editor after reviewing the project-specific settings.
-- All writes go through the authenticated server API; browser roles receive only
-- the narrow columns needed for public certificate verification.

alter table public.admin_users
  add column if not exists role text not null default 'viewer',
  add column if not exists is_active boolean not null default true;

alter table public.admin_users drop constraint if exists admin_users_role_check;
alter table public.admin_users add constraint admin_users_role_check
  check (role in ('super_admin', 'certificate_manager', 'event_manager', 'viewer'));

create table if not exists public.certificate_events (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 2 and 180),
  description text not null default '',
  event_date date,
  organization text not null default 'GDG on Campus, Quantum University',
  issue_date date not null default current_date,
  default_category text not null default 'Participant',
  categories text[] not null default array['Participant']::text[],
  status text not null default 'draft' check (status in ('draft', 'published', 'closed')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.certificate_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 2 and 120),
  description text not null default '',
  page_width_mm numeric not null default 297 check (page_width_mm between 100 and 500),
  page_height_mm numeric not null default 210 check (page_height_mm between 100 and 500),
  background_path text,
  background_mime_type text,
  design jsonb not null default '{}'::jsonb,
  signatories jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.certificate_event_access (
  event_id uuid not null references public.certificate_events(id) on delete cascade,
  admin_email text not null references public.admin_users(email) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (event_id, admin_email)
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  certificate_id text not null unique check (certificate_id ~ '^GDGQU-[0-9]{4}-[A-F0-9]{16}$'),
  idempotency_key text unique,
  recipient_name text not null check (length(btrim(recipient_name)) between 2 and 160),
  recipient_email text not null check (length(recipient_email) <= 254),
  event_id uuid not null references public.certificate_events(id) on delete restrict,
  template_id uuid not null references public.certificate_templates(id) on delete restrict,
  category text not null check (length(btrim(category)) between 2 and 80),
  issue_date date not null default current_date,
  status text not null default 'active' check (status in ('active', 'revoked')),
  generation_status text not null default 'pending' check (generation_status in ('pending', 'ready', 'failed')),
  pdf_storage_path text,
  qr_storage_path text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  revoked_at timestamptz,
  revoked_by uuid references auth.users(id) on delete set null,
  revocation_reason text
);

create unique index if not exists certificates_event_recipient_category_unique
  on public.certificates (event_id, lower(recipient_email), lower(category));
create index if not exists certificates_event_issue_date_idx
  on public.certificates (event_id, issue_date desc);
create index if not exists certificates_status_created_idx
  on public.certificates (status, created_at desc);
create index if not exists certificates_recipient_search_idx
  on public.certificates using gin (to_tsvector('simple', recipient_name || ' ' || certificate_id));

create table if not exists public.certificate_generation_jobs (
  id uuid primary key default gen_random_uuid(),
  idempotency_key uuid not null unique,
  event_id uuid not null references public.certificate_events(id) on delete restrict,
  template_id uuid not null references public.certificate_templates(id) on delete restrict,
  source_filename text not null default '',
  status text not null default 'queued' check (status in ('queued', 'processing', 'completed', 'partial', 'failed')),
  total_count integer not null default 0 check (total_count between 0 and 10000),
  valid_count integer not null default 0,
  invalid_count integer not null default 0,
  duplicate_count integer not null default 0,
  succeeded_count integer not null default 0,
  failed_count integer not null default 0,
  skipped_count integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now()
);
create index if not exists certificate_jobs_created_by_idx
  on public.certificate_generation_jobs (created_by, created_at desc);

create table if not exists public.certificate_generation_job_items (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.certificate_generation_jobs(id) on delete cascade,
  row_number integer not null check (row_number > 0),
  recipient_name text,
  recipient_email text,
  category text,
  raw_record jsonb not null default '{}'::jsonb,
  validation_errors jsonb not null default '[]'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'processing', 'succeeded', 'failed', 'invalid', 'duplicate', 'skipped')),
  certificate_id uuid references public.certificates(id) on delete set null,
  attempts integer not null default 0,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, row_number)
);
create index if not exists certificate_job_items_work_idx
  on public.certificate_generation_job_items (job_id, status, row_number);

create table if not exists public.certificate_audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  actor_email text,
  action text not null,
  target_type text not null,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists certificate_audit_target_idx
  on public.certificate_audit_logs (target_type, target_id, created_at desc);
create index if not exists certificate_audit_created_idx
  on public.certificate_audit_logs (created_at desc);

create table if not exists public.certificate_verification_logs (
  id bigint generated always as identity primary key,
  certificate_id uuid references public.certificates(id) on delete set null,
  result text not null check (result in ('valid', 'revoked', 'not_found')),
  created_at timestamptz not null default now()
);
create index if not exists certificate_verifications_created_idx
  on public.certificate_verification_logs (created_at desc);

alter table public.admin_users enable row level security;
alter table public.certificate_events enable row level security;
alter table public.certificate_templates enable row level security;
alter table public.certificate_event_access enable row level security;
alter table public.certificates enable row level security;
alter table public.certificate_generation_jobs enable row level security;
alter table public.certificate_generation_job_items enable row level security;
alter table public.certificate_audit_logs enable row level security;
alter table public.certificate_verification_logs enable row level security;

revoke all on public.certificate_events, public.certificate_templates,
  public.certificate_event_access, public.certificates,
  public.certificate_generation_jobs, public.certificate_generation_job_items,
  public.certificate_audit_logs, public.certificate_verification_logs
  from anon, authenticated;
grant all on public.certificate_events, public.certificate_templates,
  public.certificate_event_access, public.certificates,
  public.certificate_generation_jobs, public.certificate_generation_job_items,
  public.certificate_audit_logs, public.certificate_verification_logs
  to service_role;

-- Public verification returns only one sanitized result for a supplied ID.
-- No anonymous role can enumerate certificate or event tables.
drop view if exists public.certificate_public_verification;
create or replace function public.verify_certificate(p_certificate_id text)
returns table (
  certificate_id text,
  recipient_name text,
  category text,
  issue_date date,
  status text,
  revoked_at timestamptz,
  event_name text,
  organization text,
  event_date date
)
language sql
stable
security definer
set search_path = ''
as $$
  select c.certificate_id, c.recipient_name, c.category, c.issue_date,
         c.status, c.revoked_at, e.name, e.organization, e.event_date
  from public.certificates as c
  join public.certificate_events as e on e.id = c.event_id
  where c.certificate_id = p_certificate_id
    and c.generation_status = 'ready'
    and e.status <> 'draft'
  limit 1
$$;
revoke all on function public.verify_certificate(text) from public, anon, authenticated;
grant execute on function public.verify_certificate(text) to anon, authenticated;

-- Private bucket. Only trusted server handlers use the secret key to access files.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('certificate-files', 'certificate-files', false, 15728640,
        array['application/pdf', 'image/png', 'image/jpeg']::text[])
on conflict (id) do update set public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

comment on table public.certificates is
  'Official certificate issuance records. Writes are server-only; public access is restricted to verification fields.';
comment on table public.certificate_audit_logs is
  'Append-only certificate management audit history; no browser role has write access.';
