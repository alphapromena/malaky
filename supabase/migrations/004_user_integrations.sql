-- User-level integrations / connectors registry.
-- Each row = one connector a user has enabled (native toggle, OAuth token,
-- API key, webhook, ...). Config blob is opaque per-provider.

create table public.user_integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  provider text not null,
  status text not null check (status in ('connected','pending','disconnected')) default 'disconnected',
  config jsonb,
  connected_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, provider)
);

create index user_integrations_user_idx on public.user_integrations(user_id, status);

create trigger user_integrations_updated_at
before update on public.user_integrations
for each row execute function public.set_updated_at();

alter table public.user_integrations enable row level security;

create policy "ui_all_own" on public.user_integrations
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
