create extension if not exists "pgcrypto";

drop table if exists public.payment_sessions cascade;
drop table if exists public.appointments cascade;
drop table if exists public.doctors cascade;

create table public.doctors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specialization text not null,
  available_days text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  email text not null,
  phone text not null,
  doctor_id uuid not null references public.doctors(id) on delete restrict,
  appointment_date date not null,
  appointment_time text not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'rescheduled')),
  payment_status text not null default 'unpaid' check (payment_status in ('paid', 'unpaid')),
  transaction_id text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payment_sessions (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  email text not null,
  phone text not null,
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  appointment_date date not null,
  appointment_time text not null,
  amount numeric(10,2) not null,
  transaction_uuid text not null unique,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  transaction_code text,
  appointment_id uuid references public.appointments(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists appointments_unique_active_slot
  on public.appointments (doctor_id, appointment_date, appointment_time)
  where status <> 'cancelled';

create index if not exists appointments_date_idx
  on public.appointments (appointment_date);

create index if not exists appointments_status_idx
  on public.appointments (status);

create index if not exists appointments_doctor_idx
  on public.appointments (doctor_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger doctors_set_updated_at
before update on public.doctors
for each row
execute function public.set_updated_at();

create trigger appointments_set_updated_at
before update on public.appointments
for each row
execute function public.set_updated_at();

create trigger payment_sessions_set_updated_at
before update on public.payment_sessions
for each row
execute function public.set_updated_at();

alter table public.doctors enable row level security;
alter table public.appointments enable row level security;
alter table public.payment_sessions enable row level security;

create policy "Public can read doctors"
on public.doctors
for select
to anon, authenticated
using (true);

create policy "Authenticated users can manage doctors"
on public.doctors
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated users can read appointments"
on public.appointments
for select
to authenticated
using (true);

create policy "Authenticated users can manage appointments"
on public.appointments
for all
to authenticated
using (true)
with check (true);

insert into public.doctors (name, specialization, available_days)
values
  ('Dr. Anup Timalsina', 'General Dentistry', array['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']),
  ('Dr. Niraj Timalsina', 'Orthodontics', array['Sunday', 'Tuesday', 'Thursday', 'Friday']),
  ('Dr. Sanjit Adhikari', 'Oral Surgery', array['Monday', 'Wednesday', 'Friday']);
