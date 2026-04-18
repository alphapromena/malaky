-- Extend profiles with AI preferences (nickname, custom instructions,
-- preferred dialect, tone).

alter table public.profiles
  add column nickname text,
  add column custom_instructions text,
  add column preferred_dialect text
    check (preferred_dialect in ('AUTO','MSA','LEVANTINE','GULF','EGYPTIAN','MAGHREBI'))
    default 'AUTO',
  add column tone text
    check (tone in ('formal','friendly','playful'))
    default 'friendly';
