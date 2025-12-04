-- Messages table for chat history tied to Supabase Auth users
create extension if not exists "pgcrypto";

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

create index if not exists messages_user_id_idx on public.messages (user_id);
create index if not exists messages_user_created_idx on public.messages (user_id, created_at);

-- Enable RLS to protect user data; service role bypasses these policies.
alter table public.messages enable row level security;

-- Recreate policies idempotently
drop policy if exists "Users can read their messages" on public.messages;
create policy "Users can read their messages"
  on public.messages for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their messages" on public.messages;
create policy "Users can insert their messages"
  on public.messages for insert
  with check (auth.uid() = user_id);
