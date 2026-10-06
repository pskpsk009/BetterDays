-- MyGrowth grounding exercise schema
-- Run this in the Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.grounding_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  reflection text,
  created_at timestamptz not null default now(),
  constraint grounding_session_completion_check
    check (completed_at is null or completed_at >= started_at)
);

create table if not exists public.grounding_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.grounding_sessions(id) on delete cascade,
  step_number smallint not null,
  sense text not null,
  item_number smallint not null,
  answer text not null,
  created_at timestamptz not null default now(),
  constraint grounding_answer_step_check
    check (step_number between 1 and 5),
  constraint grounding_answer_item_check
    check (item_number between 1 and 5),
  constraint grounding_answer_sense_check
    check (sense in ('see', 'touch', 'hear', 'smell', 'taste')),
  constraint grounding_answer_unique_item
    unique (session_id, step_number, item_number)
);

create index if not exists grounding_sessions_user_id_idx
  on public.grounding_sessions(user_id, created_at desc);

create index if not exists grounding_answers_session_id_idx
  on public.grounding_answers(session_id, step_number, item_number);

alter table public.grounding_sessions enable row level security;
alter table public.grounding_answers enable row level security;

drop policy if exists "Users can read their grounding sessions" on public.grounding_sessions;
drop policy if exists "Users can create their grounding sessions" on public.grounding_sessions;
drop policy if exists "Users can update their grounding sessions" on public.grounding_sessions;
drop policy if exists "Users can delete their grounding sessions" on public.grounding_sessions;
drop policy if exists "Users can read their grounding answers" on public.grounding_answers;
drop policy if exists "Users can create their grounding answers" on public.grounding_answers;
drop policy if exists "Users can update their grounding answers" on public.grounding_answers;
drop policy if exists "Users can delete their grounding answers" on public.grounding_answers;
drop policy if exists "Users can upload their trail drawings" on storage.objects;
drop policy if exists "Users can read their trail drawings" on storage.objects;
drop policy if exists "Users can delete their trail drawings" on storage.objects;

create policy "Users can read their grounding sessions"
  on public.grounding_sessions
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create their grounding sessions"
  on public.grounding_sessions
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their grounding sessions"
  on public.grounding_sessions
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their grounding sessions"
  on public.grounding_sessions
  for delete
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can read their grounding answers"
  on public.grounding_answers
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.grounding_sessions
      where grounding_sessions.id = grounding_answers.session_id
        and grounding_sessions.user_id = auth.uid()
    )
  );

create policy "Users can create their grounding answers"
  on public.grounding_answers
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.grounding_sessions
      where grounding_sessions.id = grounding_answers.session_id
        and grounding_sessions.user_id = auth.uid()
    )
  );

create policy "Users can update their grounding answers"
  on public.grounding_answers
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.grounding_sessions
      where grounding_sessions.id = grounding_answers.session_id
        and grounding_sessions.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.grounding_sessions
      where grounding_sessions.id = grounding_answers.session_id
        and grounding_sessions.user_id = auth.uid()
    )
  );

create policy "Users can delete their grounding answers"
  on public.grounding_answers
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.grounding_sessions
      where grounding_sessions.id = grounding_answers.session_id
        and grounding_sessions.user_id = auth.uid()
    )
  );

-- Public trail gallery metadata and image storage.
create table if not exists public.public_trails (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  image_path text not null,
  mode text not null check (mode in ('indoor', 'outdoor')),
  distance_m numeric not null default 0 check (distance_m >= 0),
  created_at timestamptz not null default now()
);

create index if not exists public_trails_created_at_idx
  on public.public_trails(created_at desc);

alter table public.public_trails enable row level security;

drop policy if exists "Anyone can view public trails" on public.public_trails;
drop policy if exists "Users can publish their trails" on public.public_trails;
drop policy if exists "Users can delete their published trails" on public.public_trails;

create policy "Anyone can view public trails"
  on public.public_trails
  for select
  to anon, authenticated
  using (true);

create policy "Users can publish their trails"
  on public.public_trails
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete their published trails"
  on public.public_trails
  for delete
  to authenticated
  using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('public-trails', 'public-trails', true)
on conflict (id) do nothing;

update storage.buckets
set public = true
where id = 'public-trails';

drop policy if exists "Users can upload their public trail images" on storage.objects;
drop policy if exists "Anyone can view public trail images" on storage.objects;
drop policy if exists "Users can delete their public trail images" on storage.objects;

create policy "Users can upload their public trail images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'public-trails'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Anyone can view public trail images"
  on storage.objects
  for select
  to anon, authenticated
  using (
    bucket_id = 'public-trails'
  );

create policy "Users can delete their public trail images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'public-trails'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
