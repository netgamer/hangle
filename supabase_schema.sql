-- ============================================================
-- 한글 공부 - Supabase Schema
-- Supabase SQL Editor에서 실행하세요
-- ============================================================

-- 사용자 학습 데이터 테이블
create table if not exists public.hangle_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text default '',
  avatar_url text default '',
  xp integer default 0,
  progress jsonb default '{}'::jsonb,
  srs_data jsonb default '{}'::jsonb,
  streak_count integer default 0,
  streak_date text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS 활성화
alter table public.hangle_users enable row level security;

-- 정책: 자기 데이터만 읽기
create policy "Users can read own data"
  on public.hangle_users for select
  using (auth.uid() = user_id);

-- 정책: 자기 데이터만 쓰기
create policy "Users can insert own data"
  on public.hangle_users for insert
  with check (auth.uid() = user_id);

-- 정책: 자기 데이터만 수정
create policy "Users can update own data"
  on public.hangle_users for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
