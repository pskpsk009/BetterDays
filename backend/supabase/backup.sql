-- MyGrowth backup, consent, audit, and account deletion.
-- Run in the Supabase SQL editor after schema.sql. Safe to run again.
--
-- Free-plan friendly by design:
-- * Backup is one row per saved feature per user (at most 5 rows, each capped
--   at 64 KB; real values are a few KB). The app overwrites the row instead
--   of adding history, so storage does not grow with use.
-- * Consent and audit rows are a few bytes each and only written on rare
--   events (backup on/off, export, delete). Audit rows are purged after 180 days.
-- * Backup only runs for signed-in, non-anonymous users who have consented;
--   the database enforces this, not just the app.

-- ---------- Helpers ----------

create or replace function public.is_real_user()
returns boolean
language sql
stable
set search_path = ''
as $$
  select auth.uid() is not null
    and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false;
$$;

-- ---------- Consent (LR1, LR7) ----------

create table if not exists public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  purpose text not null check (purpose in ('backup')),
  version smallint not null check (version > 0),
  accepted_at timestamptz not null default now(),
  withdrawn_at timestamptz,
  constraint consent_withdrawal_check check (withdrawn_at is null or withdrawn_at >= accepted_at)
);

create index if not exists consents_user_idx on public.consents(user_id, accepted_at desc);

alter table public.consents enable row level security;

drop policy if exists "Users can read their consents" on public.consents;
drop policy if exists "Users can give consent" on public.consents;
drop policy if exists "Users can withdraw consent" on public.consents;

create policy "Users can read their consents"
  on public.consents for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can give consent"
  on public.consents for insert to authenticated
  with check (auth.uid() = user_id and public.is_real_user() and withdrawn_at is null);

-- Withdrawal is the only allowed change; acceptance is never rewritten.
create policy "Users can withdraw consent"
  on public.consents for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id and withdrawn_at is not null);

revoke update on public.consents from authenticated;
grant update (withdrawn_at) on public.consents to authenticated;

create or replace function public.has_backup_consent()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.consents
    where user_id = auth.uid() and purpose = 'backup' and withdrawn_at is null
  );
$$;

-- ---------- Backup (one row per saved feature) ----------

create table if not exists public.user_data (
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null check (key in ('support-circle', 'values-compass', 'skills', 'sleep', 'welcome')),
  value jsonb not null,
  -- Set by the device when the value last changed; newest wins on sync.
  updated_at timestamptz not null,
  primary key (user_id, key),
  constraint user_data_size_check check (pg_column_size(value) <= 65536)
);

alter table public.user_data enable row level security;

drop policy if exists "Users can read their backup" on public.user_data;
drop policy if exists "Users can create their backup" on public.user_data;
drop policy if exists "Users can update their backup" on public.user_data;
drop policy if exists "Users can delete their backup" on public.user_data;

create policy "Users can read their backup"
  on public.user_data for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can create their backup"
  on public.user_data for insert to authenticated
  with check (auth.uid() = user_id and public.is_real_user() and public.has_backup_consent());

create policy "Users can update their backup"
  on public.user_data for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id and public.is_real_user() and public.has_backup_consent());

create policy "Users can delete their backup"
  on public.user_data for delete to authenticated
  using (auth.uid() = user_id);

-- ---------- Audit events (LR6) ----------
-- No foreign key: a deletion record may outlive the account, as rule.md allows.

create table if not exists public.audit_events (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  action text not null check (action in ('backup_on', 'backup_off', 'export', 'data_deleted', 'account_deleted')),
  created_at timestamptz not null default now()
);

create index if not exists audit_events_created_idx on public.audit_events(created_at);

alter table public.audit_events enable row level security;

drop policy if exists "Users can record their own events" on public.audit_events;

-- Insert only. Nobody can read audit rows through the API.
create policy "Users can record their own events"
  on public.audit_events for insert to authenticated
  with check (auth.uid() = user_id and action in ('export', 'data_deleted'));

-- Consent changes are logged here, and withdrawing consent deletes the backup.
create or replace function public.on_consent_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.audit_events (user_id, action) values (new.user_id, 'backup_on');
  elsif old.withdrawn_at is null and new.withdrawn_at is not null then
    insert into public.audit_events (user_id, action) values (new.user_id, 'backup_off');
    delete from public.user_data where user_id = new.user_id;
  end if;
  return new;
end;
$$;

drop trigger if exists consent_change on public.consents;
create trigger consent_change
  after insert or update of withdrawn_at on public.consents
  for each row execute function public.on_consent_change();

create or replace function public.purge_old_audit_events()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from public.audit_events where created_at < now() - interval '180 days';
$$;

revoke execute on function public.purge_old_audit_events() from public, anon, authenticated;

-- Optional, recommended: purge weekly. Enable pg_cron under
-- Database -> Extensions first, then run:
-- select cron.schedule('purge-audit-events', '0 3 * * 0', 'select public.purge_old_audit_events()');

-- ---------- Account deletion (LR3) ----------
-- Deletes the signed-in user. Cascades remove their backup, consents, and
-- trail rows. Trail images must be removed through the Storage API first
-- (the app does this), because Supabase blocks deleting storage objects in SQL.

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Not signed in';
  end if;
  insert into public.audit_events (user_id, action) values (uid, 'account_deleted');
  delete from auth.users where id = uid;
end;
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- ---------- Trail storage limits ----------
-- Trails are small SVG drawings; this stops oversized or unexpected files.

update storage.buckets
set file_size_limit = 524288,
    allowed_mime_types = array['image/svg+xml', 'image/jpeg']
where id = 'public-trails';
