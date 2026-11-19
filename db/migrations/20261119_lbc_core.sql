-- Local Beef Club: shared tables on the Life Produces Life Supabase (lbc_* prefix).
-- The app only holds the public (publishable) key, so every table has RLS on with
-- no policies, and the only way in is through the SECURITY DEFINER functions below.
-- Public functions accept a reservation or a farmer sign-up and return aggregate
-- counts with no names or contact details. Desk functions require a session token
-- minted by lbc_desk_login against a hashed password.

create table if not exists public.lbc_reservations (
  id text primary key,
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text not null,
  role text not null,
  product_id text not null,
  species text not null default 'beef',
  drop_id text,
  qty int not null default 1,
  est_lb numeric not null default 0,
  fulfillment text not null,
  standing boolean not null default false,
  standing_cadence text,
  gift_to text,
  notes text,
  wait_ok boolean not null default false,
  status text not null default 'reserved',
  desk_note text
);

create table if not exists public.lbc_farmers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  farm_name text,
  email text,
  phone text not null,
  area text,
  species text[] not null default '{}',
  practices text,
  processor text,
  available text,
  notes text,
  status text not null default 'new',
  desk_note text
);

create table if not exists public.lbc_desk_secret (
  id int primary key default 1 check (id = 1),
  pw_hash text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.lbc_desk_sessions (
  token_hash text primary key,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

alter table public.lbc_reservations enable row level security;
alter table public.lbc_farmers enable row level security;
alter table public.lbc_desk_secret enable row level security;
alter table public.lbc_desk_sessions enable row level security;
revoke all on public.lbc_reservations, public.lbc_farmers, public.lbc_desk_secret, public.lbc_desk_sessions from anon, authenticated;

create index if not exists lbc_reservations_drop_idx on public.lbc_reservations (drop_id);
create index if not exists lbc_reservations_species_idx on public.lbc_reservations (species);

-- Trim and cap free text so the public functions cannot be used to store junk at scale.
create or replace function public.lbc_txt(v jsonb, k text, max_len int)
returns text language sql immutable set search_path = '' as $$
  select nullif(left(btrim(coalesce(v ->> k, '')), max_len), '')
$$;

create or replace function public.lbc_reserve(p jsonb)
returns text language plpgsql security definer set search_path = '' as $$
declare
  ticket text;
  q int := greatest(1, least(coalesce((p ->> 'qty')::int, 1), 500));
  lb numeric := greatest(0, least(coalesce((p ->> 'estLb')::numeric, 0), 20000));
begin
  if public.lbc_txt(p, 'name', 120) is null then raise exception 'Name is required.'; end if;
  if coalesce(public.lbc_txt(p, 'email', 200), '') !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'A working email is required.'; end if;
  if public.lbc_txt(p, 'phone', 40) is null then raise exception 'Phone is required.'; end if;
  if public.lbc_txt(p, 'productId', 40) is null then raise exception 'Choose what you want.'; end if;
  if coalesce((p ->> 'waitOk')::boolean, false) is not true then raise exception 'Please confirm you understand the wait.'; end if;
  ticket := 'LBC-' || upper(substr(md5(gen_random_uuid()::text), 1, 6));
  insert into public.lbc_reservations (
    id, name, email, phone, role, product_id, species, drop_id, qty, est_lb, fulfillment,
    standing, standing_cadence, gift_to, notes, wait_ok
  ) values (
    ticket,
    public.lbc_txt(p, 'name', 120),
    lower(public.lbc_txt(p, 'email', 200)),
    public.lbc_txt(p, 'phone', 40),
    coalesce(public.lbc_txt(p, 'role', 20), 'family'),
    public.lbc_txt(p, 'productId', 40),
    coalesce(public.lbc_txt(p, 'species', 20), 'beef'),
    public.lbc_txt(p, 'dropId', 40),
    q,
    lb,
    coalesce(public.lbc_txt(p, 'fulfillment', 30), 'processor-pickup'),
    coalesce((p ->> 'standing')::boolean, false),
    public.lbc_txt(p, 'standingCadence', 20),
    public.lbc_txt(p, 'giftTo', 200),
    public.lbc_txt(p, 'notes', 2000),
    true
  );
  return ticket;
end $$;

create or replace function public.lbc_farmer_apply(p jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  new_id uuid;
  sp text[];
begin
  if public.lbc_txt(p, 'name', 120) is null then raise exception 'Name is required.'; end if;
  if public.lbc_txt(p, 'phone', 40) is null then raise exception 'Phone is required.'; end if;
  select coalesce(array_agg(left(x, 20)), '{}') into sp
    from (select jsonb_array_elements_text(coalesce(p -> 'species', '[]'::jsonb)) as x limit 8) s;
  insert into public.lbc_farmers (name, farm_name, email, phone, area, species, practices, processor, available, notes)
  values (
    public.lbc_txt(p, 'name', 120),
    public.lbc_txt(p, 'farmName', 160),
    lower(public.lbc_txt(p, 'email', 200)),
    public.lbc_txt(p, 'phone', 40),
    public.lbc_txt(p, 'area', 160),
    sp,
    public.lbc_txt(p, 'practices', 2000),
    public.lbc_txt(p, 'processor', 300),
    public.lbc_txt(p, 'available', 1000),
    public.lbc_txt(p, 'notes', 2000)
  ) returning id into new_id;
  return new_id;
end $$;

-- Public, no personal data: reserved pounds per drop and people waiting per species.
create or replace function public.lbc_public_counts()
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'drops', coalesce((
      select jsonb_object_agg(drop_id, jsonb_build_object('lb', lb, 'reservations', n))
      from (select drop_id, sum(est_lb) lb, count(*) n from public.lbc_reservations
            where drop_id is not null and status <> 'cancelled' group by drop_id) d), '{}'::jsonb),
    'species', coalesce((
      select jsonb_object_agg(species, n)
      from (select species, count(*) n from public.lbc_reservations
            where status <> 'cancelled' group by species) s), '{}'::jsonb),
    'farmers', (select count(*) from public.lbc_farmers where status <> 'declined')
  )
$$;

create or replace function public.lbc_desk_login(pw text)
returns text language plpgsql security definer set search_path = '' as $$
declare
  h text;
  tok text;
begin
  select pw_hash into h from public.lbc_desk_secret where id = 1;
  if h is null or pw is null or extensions.crypt(pw, h) <> h then
    perform pg_sleep(0.5);
    return null;
  end if;
  tok := encode(extensions.gen_random_bytes(32), 'hex');
  delete from public.lbc_desk_sessions where expires_at < now();
  insert into public.lbc_desk_sessions (token_hash, expires_at)
  values (encode(extensions.digest(tok, 'sha256'), 'hex'), now() + interval '30 days');
  return tok;
end $$;

create or replace function public.lbc_desk_ok(tok text)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.lbc_desk_sessions
    where token_hash = encode(extensions.digest(coalesce(tok, ''), 'sha256'), 'hex') and expires_at > now()
  )
$$;

create or replace function public.lbc_desk_data(tok text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.lbc_desk_ok(tok) then raise exception 'Desk session expired. Sign in again.'; end if;
  return jsonb_build_object(
    'reservations', coalesce((select jsonb_agg(to_jsonb(r) order by r.created_at desc) from public.lbc_reservations r), '[]'::jsonb),
    'farmers', coalesce((select jsonb_agg(to_jsonb(f) order by f.created_at desc) from public.lbc_farmers f), '[]'::jsonb)
  );
end $$;

create or replace function public.lbc_desk_update(tok text, kind text, row_id text, new_status text, note text)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if not public.lbc_desk_ok(tok) then raise exception 'Desk session expired. Sign in again.'; end if;
  if kind = 'reservation' then
    if new_status not in ('reserved', 'confirmed', 'ready', 'picked-up', 'cancelled') then raise exception 'Unknown status.'; end if;
    update public.lbc_reservations set status = new_status, desk_note = left(note, 2000) where id = row_id;
  elsif kind = 'farmer' then
    if new_status not in ('new', 'talking', 'confirmed', 'declined') then raise exception 'Unknown status.'; end if;
    update public.lbc_farmers set status = new_status, desk_note = left(note, 2000) where id = row_id::uuid;
  else
    raise exception 'Unknown kind.';
  end if;
  return found;
end $$;

create or replace function public.lbc_desk_set_password(tok text, new_pw text)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if not public.lbc_desk_ok(tok) then raise exception 'Desk session expired. Sign in again.'; end if;
  if length(coalesce(new_pw, '')) < 10 then raise exception 'Use at least 10 characters.'; end if;
  update public.lbc_desk_secret set pw_hash = extensions.crypt(new_pw, extensions.gen_salt('bf')), updated_at = now() where id = 1;
  delete from public.lbc_desk_sessions where token_hash <> encode(extensions.digest(tok, 'sha256'), 'hex');
  return true;
end $$;

create or replace function public.lbc_desk_logout(tok text)
returns boolean language sql security definer set search_path = '' as $$
  delete from public.lbc_desk_sessions where token_hash = encode(extensions.digest(coalesce(tok, ''), 'sha256'), 'hex') returning true
$$;

revoke all on function public.lbc_txt(jsonb, text, int), public.lbc_desk_ok(text) from public, anon, authenticated;
revoke all on function
  public.lbc_reserve(jsonb), public.lbc_farmer_apply(jsonb), public.lbc_public_counts(),
  public.lbc_desk_login(text), public.lbc_desk_data(text), public.lbc_desk_update(text, text, text, text, text),
  public.lbc_desk_set_password(text, text), public.lbc_desk_logout(text)
from public;
grant execute on function
  public.lbc_reserve(jsonb), public.lbc_farmer_apply(jsonb), public.lbc_public_counts(),
  public.lbc_desk_login(text), public.lbc_desk_data(text), public.lbc_desk_update(text, text, text, text, text),
  public.lbc_desk_set_password(text, text), public.lbc_desk_logout(text)
to anon, authenticated, service_role;

-- The desk password itself is set out of band (never committed):
-- insert into public.lbc_desk_secret (id, pw_hash) values (1, extensions.crypt('<password>', extensions.gen_salt('bf')))
--   on conflict (id) do update set pw_hash = excluded.pw_hash, updated_at = now();
