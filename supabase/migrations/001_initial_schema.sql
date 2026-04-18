-- Conversations (session-based, no users)
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  mode text not null check (mode in ('WRITER','CODER','DESIGNER')),
  title text,
  dialect_used text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index conversations_session_idx on public.conversations(session_id, created_at desc);
create index conversations_mode_idx on public.conversations(session_id, mode);

-- Messages
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

-- Generated images
create table public.generated_images (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations on delete cascade not null,
  session_id text not null,
  arabic_prompt text not null,
  english_prompt text not null,
  image_url text not null,
  image_storage_path text not null,
  cost_usd numeric(10,6),
  created_at timestamptz default now()
);

create index generated_images_session_idx on public.generated_images(session_id, created_at desc);

-- Rate limiting
create table public.rate_limits (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  mode text not null,
  count int default 0,
  reset_at timestamptz default now(),
  unique(session_id, mode)
);

-- RLS: server-side writes use service role; clients cannot read
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.generated_images enable row level security;
alter table public.rate_limits enable row level security;

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger conversations_updated_at
before update on public.conversations
for each row execute function public.set_updated_at();

-- Storage bucket + policies
insert into storage.buckets (id, name, public)
values ('malaky-images', 'malaky-images', true)
on conflict (id) do nothing;

create policy "Public read access for malaky-images"
on storage.objects for select
using (bucket_id = 'malaky-images');

create policy "Service role full access for malaky-images"
on storage.objects for all
to service_role
using (bucket_id = 'malaky-images')
with check (bucket_id = 'malaky-images');
