-- Auth migration: drop session-based schema, introduce user-based schema
-- with profiles table and RLS policies.

drop table if exists public.rate_limits cascade;
drop table if exists public.generated_images cascade;
drop table if exists public.messages cascade;
drop table if exists public.conversations cascade;

-- Profiles, one row per auth.users
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  age int not null check (age >= 13 and age <= 120),
  avatar_url text,
  terms_accepted_at timestamptz not null default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  mode text not null check (mode in ('WRITER','CODER','DESIGNER')),
  title text,
  dialect_used text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index conversations_user_updated_idx on public.conversations(user_id, updated_at desc);
create index conversations_user_mode_idx on public.conversations(user_id, mode);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations on delete cascade not null,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  model_used text,
  tokens_input int,
  tokens_output int,
  cost_usd numeric(10,6),
  latency_ms int,
  created_at timestamptz default now()
);
create index messages_conversation_idx on public.messages(conversation_id, created_at);

create table public.generated_images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  conversation_id uuid references public.conversations on delete cascade not null,
  arabic_prompt text not null,
  english_prompt text not null,
  image_url text not null,
  image_storage_path text not null,
  cost_usd numeric(10,6),
  created_at timestamptz default now()
);
create index generated_images_user_idx on public.generated_images(user_id, created_at desc);

create table public.rate_limits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  mode text not null,
  count int default 0,
  reset_at timestamptz default now(),
  unique(user_id, mode)
);

create trigger conversations_updated_at
before update on public.conversations
for each row execute function public.set_updated_at();

create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.generated_images enable row level security;
alter table public.rate_limits enable row level security;

create policy "profile_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profile_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profile_update_own" on public.profiles for update using (auth.uid() = id);

create policy "conv_all_own" on public.conversations
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "msg_all_via_conv" on public.messages
for all using (
  exists (select 1 from public.conversations c
          where c.id = messages.conversation_id and c.user_id = auth.uid())
) with check (
  exists (select 1 from public.conversations c
          where c.id = messages.conversation_id and c.user_id = auth.uid())
);

create policy "img_all_own" on public.generated_images
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "rl_all_own" on public.rate_limits
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
