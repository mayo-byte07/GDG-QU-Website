-- Admin passwords are created and managed in Supabase Auth, never in this table.
-- This table only grants admin-panel access to an existing Auth account.
create table if not exists public.admin_users (
  email text primary key check (email = lower(btrim(email))),
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
revoke all on table public.admin_users from anon, authenticated;
grant select on table public.admin_users to service_role;

comment on table public.admin_users is
  'Allowlist for admin dashboard access; passwords are stored by Supabase Auth, never in this table.';

-- Replace the example email below, then run this to grant admin access.
-- It inserts only if the Auth user exists and has a confirmed email.
insert into public.admin_users (email)
select lower(btrim(u.email))
from auth.users as u
where lower(btrim(u.email)) = lower(btrim('admin@example.com'))
  and u.email_confirmed_at is not null
on conflict (email) do nothing;

-- Run this query to cross-check that the account exists, is confirmed,
-- and is on the admin allowlist. It intentionally never reads password hashes.
select
  u.email,
  (u.email_confirmed_at is not null) as email_confirmed,
  (a.email is not null) as admin_access,
  a.created_at as admin_added_at
from auth.users as u
left join public.admin_users as a on a.email = lower(btrim(u.email))
where lower(btrim(u.email)) = lower(btrim('admin@example.com'));
