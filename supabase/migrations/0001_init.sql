-- Jaano V0 schema.
create extension if not exists "pgcrypto";

create type order_state as enum (
  'NEW','QUESTIONNAIRE_COMPLETED','PAID',
  'REPORT_GENERATING','REPORT_READY','REVIEWED','DELIVERED'
);

-- Attribution captured at first touch and carried all the way to purchase.
create table attribution (
  id           uuid primary key default gen_random_uuid(),
  utm_source   text, utm_medium text, utm_campaign text, utm_content text, utm_term text,
  fbclid       text, fbp text, fbc text, gclid text,
  landing_path text,
  referrer     text,
  created_at   timestamptz not null default now()
);

-- Free-tool captures. A lead may never become an order.
create table leads (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null,
  dob           date not null,
  phone         text,
  email         text,
  computed      jsonb,
  attribution_id uuid references attribution(id),
  created_at    timestamptz not null default now()
);
create index leads_created_idx on leads (created_at desc);

create table orders (
  id             uuid primary key default gen_random_uuid(),
  reference      text not null unique,          -- JN-2026-0417, shown to customers
  product_slug   text not null,
  state          order_state not null default 'NEW',
  amount_paise   integer not null check (amount_paise >= 0),
  currency       text not null default 'INR',
  full_name      text not null,
  dob            date,
  phone          text,
  email          text,
  razorpay_order_id   text unique,
  razorpay_payment_id text unique,
  lead_id        uuid references leads(id),
  attribution_id uuid references attribution(id),
  -- one timestamp per transition, so the funnel is queryable without a log join
  questionnaire_at timestamptz, paid_at timestamptz, generating_at timestamptz,
  ready_at timestamptz, reviewed_at timestamptz, delivered_at timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index orders_state_idx on orders (state, created_at desc);
create index orders_product_idx on orders (product_slug, created_at desc);
create index orders_phone_idx on orders (phone);

create table responses (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references orders(id) on delete cascade,
  answers    jsonb not null,
  created_at timestamptz not null default now()
);
create unique index responses_order_idx on responses (order_id);

create table reports (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references orders(id) on delete cascade,
  version       integer not null default 1,
  -- everything the engine worked out; the source of truth for all numbers
  computed      jsonb not null,
  -- interpretation only, validated against the product's section schema
  sections      jsonb,
  engine_version text not null,
  model         text,
  claims_passed boolean not null default false,
  claims_notes  jsonb,
  reviewed_by   text,
  created_at    timestamptz not null default now()
);
create unique index reports_order_version_idx on reports (order_id, version);

-- Long random slug for /r/<token>. Never guessable, never sequential.
create table access_tokens (
  token      text primary key,
  order_id   uuid not null references orders(id) on delete cascade,
  created_at timestamptz not null default now(),
  last_seen  timestamptz
);

create table consultations (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid references orders(id),
  amount_paise integer not null,
  razorpay_payment_id text unique,
  scheduled_at timestamptz,
  created_at   timestamptz not null default now()
);

-- One row per funnel step, for the metrics in the plan.
create table events (
  id         bigserial primary key,
  name       text not null,
  order_id   uuid references orders(id) on delete cascade,
  lead_id    uuid references leads(id) on delete cascade,
  props      jsonb,
  created_at timestamptz not null default now()
);
create index events_name_idx on events (name, created_at desc);

create or replace function touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;
create trigger orders_touch before update on orders
  for each row execute function touch_updated_at();

-- Nothing is reachable with the anon key; all access goes through the server.
alter table attribution   enable row level security;
alter table leads         enable row level security;
alter table orders        enable row level security;
alter table responses     enable row level security;
alter table reports       enable row level security;
alter table access_tokens enable row level security;
alter table consultations enable row level security;
alter table events        enable row level security;
