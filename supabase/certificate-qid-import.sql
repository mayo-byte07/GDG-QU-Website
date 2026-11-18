-- Enable issuing imported original PDFs using recipient name + QID.
-- Apply after certificate-management.sql in the Supabase SQL Editor.

alter table public.certificates
  alter column recipient_email drop not null,
  alter column template_id drop not null,
  add column if not exists recipient_qid text,
  add column if not exists issuer_name text,
  add column if not exists issuer_qid text,
  add column if not exists issuer_email text;

alter table public.certificates
  drop constraint if exists certificates_recipient_qid_format;
alter table public.certificates
  add constraint certificates_recipient_qid_format
  check (recipient_qid is null or recipient_qid ~ '^[A-Za-z0-9-]{4,32}$');

drop index if exists public.certificates_event_recipient_category_unique;
create unique index if not exists certificates_event_qid_category_unique
  on public.certificates (event_id, recipient_qid, lower(category))
  where recipient_qid is not null;

drop function if exists public.verify_certificate(text);

create function public.verify_certificate(p_certificate_id text)
returns table (
  certificate_id text,
  recipient_name text,
  recipient_qid text,
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
  select c.certificate_id, c.recipient_name, c.recipient_qid, c.category,
         c.issue_date, c.status, c.revoked_at, e.name, e.organization, e.event_date
  from public.certificates as c
  join public.certificate_events as e on e.id = c.event_id
  where c.certificate_id = p_certificate_id
    and c.generation_status = 'ready'
    and e.status <> 'draft'
  limit 1
$$;
revoke all on function public.verify_certificate(text) from public, anon, authenticated;
grant execute on function public.verify_certificate(text) to anon, authenticated;
