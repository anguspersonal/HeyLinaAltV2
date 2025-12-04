-- LLM response evaluation schema (mirrors SQL applied in dashboard)
-- Safe to rerun: relies on IF NOT EXISTS guards where supported.

-- Ensure UUID generation is available
create extension if not exists "pgcrypto";

-- Inputs captured for evaluation
create table if not exists public.inputs (
  id uuid primary key default gen_random_uuid(),
  category text,
  input_text text not null,
  rubric jsonb,
  created_at timestamptz default now()
);

-- Model responses to evaluated inputs
create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  input_id uuid references public.inputs (id),
  model_name text not null,
  response_text text not null,
  created_at timestamptz default now()
);

-- Evaluation results comparing responses
create table if not exists public.evaluations (
  id uuid primary key default gen_random_uuid(),
  input_id uuid references public.inputs (id),
  response_a_id uuid references public.responses (id),
  response_b_id uuid references public.responses (id),
  winner text,
  scores jsonb,
  rationale text,
  evaluator_model text,
  created_at timestamptz default now()
);

-- Helpful indexes for lookups
create index if not exists responses_input_id_idx on public.responses (input_id);
create index if not exists evaluations_input_id_idx on public.evaluations (input_id);
create index if not exists evaluations_response_a_id_idx on public.evaluations (response_a_id);
create index if not exists evaluations_response_b_id_idx on public.evaluations (response_b_id);
