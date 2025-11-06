-- Tables
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  basalam_user_id bigint,
  name text,
  mobile text,
  vendor_id bigint,
  created_at timestamptz default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  access_token text not null,
  refresh_token text,
  expires_at timestamptz,
  last_activity timestamptz default now(),
  user_agent text,
  created_at timestamptz default now()
);

create table if not exists credits_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  delta integer not null,
  reason text,
  created_at timestamptz default now()
);

create table if not exists usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  type text not null,
  units integer not null,
  metadata_json jsonb,
  created_at timestamptz default now()
);

create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  kind text not null,
  rating integer,
  title text,
  message text not null,
  created_at timestamptz default now()
);

create table if not exists image_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  status text not null,
  steps_json jsonb,
  input_file_path text,
  output_file_path text,
  created_at timestamptz default now(),
  completed_at timestamptz
);

create table if not exists files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  supabase_path text,
  basalam_file_id bigint,
  kind text,
  created_at timestamptz default now()
);

