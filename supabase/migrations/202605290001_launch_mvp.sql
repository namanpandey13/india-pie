create extension if not exists "pgcrypto";

create type public.creator_status as enum ('draft', 'in_review', 'approved', 'paused', 'rejected');
create type public.verification_document_status as enum ('uploaded', 'approved', 'rejected');
create type public.venue_status as enum ('unverified', 'verified', 'restricted');
create type public.event_status as enum ('draft', 'in_review', 'planning', 'confirmed', 'cancelled', 'completed');
create type public.event_checkpoint_kind as enum (
  'venue_verified',
  'route_proof_added',
  'guest_list_reviewed',
  'creator_confirmed'
);
create type public.interest_status as enum ('interested', 'withdrawn');
create type public.rsvp_status as enum ('requested', 'accepted', 'confirmed', 'waitlisted', 'declined', 'cancelled');
create type public.attendance_status as enum ('attended', 'no_show', 'excused');
create type public.connection_status as enum ('pending', 'accepted', 'blocked');
create type public.thread_status as enum ('open', 'archived');
create type public.message_kind as enum ('host_update', 'rsvp_status', 'message');

create table public.discovery_markets (
  id text primary key,
  label text not null,
  active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.discovery_tags (
  id text primary key,
  label text not null,
  active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.creator_templates (
  id text primary key,
  label text not null,
  active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  handle text unique,
  avatar_url text,
  city text not null default 'Delhi NCR',
  bio text,
  instagram text,
  linkedin text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, handle, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    null,
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table public.creators (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  handle text not null unique,
  display_name text not null,
  title text not null,
  bio text not null,
  philosophy text,
  community_tone text,
  status public.creator_status not null default 'draft',
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null,
  review_note text,
  paused_at timestamptz,
  rating numeric(3,2),
  repeat_rate numeric(5,2),
  past_events integer not null default 0,
  recurring_attendees integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.creator_verification_documents (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade,
  document_type text not null check (document_type in ('identity', 'venue_proof', 'professional_proof')),
  storage_path text not null unique,
  status public.verification_document_status not null default 'uploaded',
  rejection_reason text,
  uploaded_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null
);

create table public.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  locality text not null,
  city text not null default 'Delhi NCR',
  address_line text,
  map_url text,
  status public.venue_status not null default 'unverified',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete restrict,
  venue_id uuid not null references public.venues(id) on delete restrict,
  title text not null,
  category text not null,
  image_url text,
  poster_text text,
  price_label text not null default 'Free',
  vibe text not null,
  about text not null,
  capacity integer not null check (capacity > 0),
  status public.event_status not null default 'draft',
  deposit_required boolean not null default false,
  deposit_amount integer,
  currency text not null default 'INR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((deposit_required = false and deposit_amount is null) or (deposit_required = true and deposit_amount >= 0))
);

create table public.event_sessions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz,
  capacity integer not null check (capacity > 0),
  created_at timestamptz not null default now()
);

create table public.event_checkpoints (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  kind public.event_checkpoint_kind not null,
  label text not null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique (event_id, kind)
);

create table public.event_tags (
  event_id uuid not null references public.events(id) on delete cascade,
  tag text not null,
  created_at timestamptz not null default now(),
  primary key (event_id, tag)
);

create table public.event_prompts (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  prompt text not null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  unique (event_id, position),
  unique (event_id, prompt)
);

create table public.event_attendee_previews (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  display_name text not null,
  role text not null,
  signal text not null,
  status text not null check (status in ('interested', 'accepted', 'confirmed')),
  initials text not null,
  accent text not null default 'violet' check (accent in ('coral', 'lime', 'blue', 'yellow', 'violet')),
  created_at timestamptz not null default now()
);

create table public.creator_credentials (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade,
  label text not null,
  created_at timestamptz not null default now(),
  unique (creator_id, label)
);

create table public.creator_links (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade,
  label text not null,
  url text,
  created_at timestamptz not null default now(),
  unique (creator_id, label)
);

create table public.event_interest (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  status public.interest_status not null default 'interested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (profile_id, event_id)
);

create table public.saved_events (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, event_id)
);

create table public.rsvp_requests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  session_id uuid references public.event_sessions(id) on delete set null,
  status public.rsvp_status not null default 'requested',
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index rsvp_requests_one_active_per_session
  on public.rsvp_requests (profile_id, event_id, coalesce(session_id, '00000000-0000-0000-0000-000000000000'::uuid))
  where status in ('requested', 'accepted', 'confirmed', 'waitlisted');

create table public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  rsvp_request_id uuid not null unique references public.rsvp_requests(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  session_id uuid references public.event_sessions(id) on delete set null,
  status public.attendance_status not null,
  recorded_at timestamptz not null default now()
);

create table public.profile_follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

create table public.creator_follows (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  creator_id uuid not null references public.creators(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, creator_id)
);

create table public.user_connections (
  requester_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  status public.connection_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (requester_id, recipient_id),
  check (requester_id <> recipient_id)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  creator_id uuid references public.creators(id) on delete cascade,
  venue_id uuid references public.venues(id) on delete set null,
  body text not null,
  context text,
  created_at timestamptz not null default now()
);

create table public.plan_inbox_threads (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete cascade,
  title text not null,
  status public.thread_status not null default 'open',
  created_at timestamptz not null default now()
);

create table public.plan_inbox_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.plan_inbox_threads(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  kind public.message_kind not null default 'message',
  body text not null,
  created_at timestamptz not null default now()
);

create index creators_status_idx on public.creators (status);
create index discovery_markets_active_position_idx on public.discovery_markets (active, position);
create index discovery_tags_active_position_idx on public.discovery_tags (active, position);
create index creator_templates_active_position_idx on public.creator_templates (active, position);
create index venues_city_status_idx on public.venues (city, status);
create index events_status_created_idx on public.events (status, created_at desc);
create index events_creator_idx on public.events (creator_id);
create index events_venue_idx on public.events (venue_id);
create index event_sessions_event_starts_idx on public.event_sessions (event_id, starts_at);
create index event_checkpoints_event_idx on public.event_checkpoints (event_id);
create index event_tags_tag_idx on public.event_tags (tag);
create index event_prompts_event_position_idx on public.event_prompts (event_id, position);
create index event_attendee_previews_event_idx on public.event_attendee_previews (event_id);
create index creator_credentials_creator_idx on public.creator_credentials (creator_id);
create index creator_links_creator_idx on public.creator_links (creator_id);
create index event_interest_event_status_idx on public.event_interest (event_id, status);
create index rsvp_requests_profile_status_idx on public.rsvp_requests (profile_id, status);
create index rsvp_requests_event_status_idx on public.rsvp_requests (event_id, status);
create index attendance_records_profile_idx on public.attendance_records (profile_id, status);
create index reviews_event_idx on public.reviews (event_id, created_at desc);
create index profile_follows_following_idx on public.profile_follows (following_id);
create index creator_follows_creator_idx on public.creator_follows (creator_id);
create index user_connections_recipient_idx on public.user_connections (recipient_id, status);
create index plan_inbox_threads_event_idx on public.plan_inbox_threads (event_id);
create index plan_inbox_messages_thread_idx on public.plan_inbox_messages (thread_id, created_at);

alter table public.profiles enable row level security;
alter table public.discovery_markets enable row level security;
alter table public.discovery_tags enable row level security;
alter table public.creator_templates enable row level security;
alter table public.creators enable row level security;
alter table public.creator_verification_documents enable row level security;
alter table public.venues enable row level security;
alter table public.events enable row level security;
alter table public.event_sessions enable row level security;
alter table public.event_checkpoints enable row level security;
alter table public.event_tags enable row level security;
alter table public.event_prompts enable row level security;
alter table public.event_attendee_previews enable row level security;
alter table public.creator_credentials enable row level security;
alter table public.creator_links enable row level security;
alter table public.event_interest enable row level security;
alter table public.saved_events enable row level security;
alter table public.rsvp_requests enable row level security;
alter table public.attendance_records enable row level security;
alter table public.profile_follows enable row level security;
alter table public.creator_follows enable row level security;
alter table public.user_connections enable row level security;
alter table public.reviews enable row level security;
alter table public.plan_inbox_threads enable row level security;
alter table public.plan_inbox_messages enable row level security;

create policy "active discovery markets public read" on public.discovery_markets for select using (active = true);
create policy "active discovery tags public read" on public.discovery_tags for select using (active = true);
create policy "active creator templates public read" on public.creator_templates for select using (active = true);

create policy "profiles public read" on public.profiles for select using (true);
create policy "profiles insert own" on public.profiles for insert with check ((select auth.uid()) = id);
create policy "profiles update own" on public.profiles for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "approved creators public read" on public.creators for select using (status = 'approved' or profile_id = (select auth.uid()));
create policy "profiles manage own creator" on public.creators for all using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));

create policy "creators manage own documents" on public.creator_verification_documents for all using (
  exists (select 1 from public.creators c where c.id = creator_id and c.profile_id = (select auth.uid()))
) with check (
  exists (select 1 from public.creators c where c.id = creator_id and c.profile_id = (select auth.uid()))
);

create policy "usable venues public read" on public.venues for select using (status in ('unverified', 'verified'));
create policy "profiles create venues" on public.venues for insert with check ((select auth.uid()) = created_by);

create policy "public event read" on public.events for select using (status in ('planning', 'confirmed', 'completed'));
create policy "creators read own events" on public.events for select using (
  exists (select 1 from public.creators c where c.id = creator_id and c.profile_id = (select auth.uid()))
);
create policy "creators manage own draft events" on public.events for all using (
  exists (select 1 from public.creators c where c.id = creator_id and c.profile_id = (select auth.uid()))
) with check (
  exists (select 1 from public.creators c where c.id = creator_id and c.profile_id = (select auth.uid()))
);

create policy "public event sessions read" on public.event_sessions for select using (
  exists (select 1 from public.events e where e.id = event_id and e.status in ('planning', 'confirmed', 'completed'))
);

create policy "public event checkpoints read" on public.event_checkpoints for select using (
  verified_at is not null and exists (
    select 1 from public.events e where e.id = event_id and e.status in ('planning', 'confirmed', 'completed')
  )
);

create policy "public event tags read" on public.event_tags for select using (
  exists (select 1 from public.events e where e.id = event_id and e.status in ('planning', 'confirmed', 'completed'))
);

create policy "public event prompts read" on public.event_prompts for select using (
  exists (select 1 from public.events e where e.id = event_id and e.status in ('planning', 'confirmed', 'completed'))
);

create policy "public event attendee previews read" on public.event_attendee_previews for select using (
  exists (select 1 from public.events e where e.id = event_id and e.status in ('planning', 'confirmed', 'completed'))
);

create policy "creators manage own event tags" on public.event_tags for all using (
  exists (
    select 1 from public.events e
    join public.creators c on c.id = e.creator_id
    where e.id = event_id and c.profile_id = (select auth.uid())
  )
) with check (
  exists (
    select 1 from public.events e
    join public.creators c on c.id = e.creator_id
    where e.id = event_id and c.profile_id = (select auth.uid())
  )
);

create policy "creators manage own event prompts" on public.event_prompts for all using (
  exists (
    select 1 from public.events e
    join public.creators c on c.id = e.creator_id
    where e.id = event_id and c.profile_id = (select auth.uid())
  )
) with check (
  exists (
    select 1 from public.events e
    join public.creators c on c.id = e.creator_id
    where e.id = event_id and c.profile_id = (select auth.uid())
  )
);

create policy "creators manage own attendee previews" on public.event_attendee_previews for all using (
  exists (
    select 1 from public.events e
    join public.creators c on c.id = e.creator_id
    where e.id = event_id and c.profile_id = (select auth.uid())
  )
) with check (
  exists (
    select 1 from public.events e
    join public.creators c on c.id = e.creator_id
    where e.id = event_id and c.profile_id = (select auth.uid())
  )
);

create policy "public creator credentials read" on public.creator_credentials for select using (
  exists (select 1 from public.creators c where c.id = creator_id and c.status = 'approved')
);

create policy "public creator links read" on public.creator_links for select using (
  exists (select 1 from public.creators c where c.id = creator_id and c.status = 'approved')
);

create policy "creators manage own credentials" on public.creator_credentials for all using (
  exists (select 1 from public.creators c where c.id = creator_id and c.profile_id = (select auth.uid()))
) with check (
  exists (select 1 from public.creators c where c.id = creator_id and c.profile_id = (select auth.uid()))
);

create policy "creators manage own links" on public.creator_links for all using (
  exists (select 1 from public.creators c where c.id = creator_id and c.profile_id = (select auth.uid()))
) with check (
  exists (select 1 from public.creators c where c.id = creator_id and c.profile_id = (select auth.uid()))
);

create policy "profiles manage own interest" on public.event_interest for all using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));
create policy "profiles manage own saves" on public.saved_events for all using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));
create policy "profiles manage own rsvps" on public.rsvp_requests for all using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));
create policy "profiles read own attendance" on public.attendance_records for select using (profile_id = (select auth.uid()));

create policy "profiles manage follows" on public.profile_follows for all using (follower_id = (select auth.uid())) with check (follower_id = (select auth.uid()));
create policy "profiles manage creator follows" on public.creator_follows for all using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));
create policy "profiles read own connections" on public.user_connections for select using (
  requester_id = (select auth.uid()) or recipient_id = (select auth.uid())
);
create policy "profiles create connection requests" on public.user_connections for insert with check (requester_id = (select auth.uid()));
create policy "profiles update own connection side" on public.user_connections for update using (
  requester_id = (select auth.uid()) or recipient_id = (select auth.uid())
);

create policy "public event reviews read" on public.reviews for select using (
  exists (select 1 from public.events e where e.id = event_id and e.status in ('planning', 'confirmed', 'completed'))
);
create policy "profiles create own reviews" on public.reviews for insert with check (reviewer_id = (select auth.uid()));

create policy "profiles read joined plan threads" on public.plan_inbox_threads for select using (
  event_id is null or exists (
    select 1 from public.rsvp_requests r
    where r.event_id = plan_inbox_threads.event_id
      and r.profile_id = (select auth.uid())
      and r.status in ('requested', 'accepted', 'confirmed', 'waitlisted')
  )
);

create policy "profiles read joined plan messages" on public.plan_inbox_messages for select using (
  exists (
    select 1 from public.plan_inbox_threads t
    join public.rsvp_requests r on r.event_id = t.event_id
    where t.id = thread_id
      and r.profile_id = (select auth.uid())
      and r.status in ('requested', 'accepted', 'confirmed', 'waitlisted')
  )
);
create policy "profiles create own plan messages" on public.plan_inbox_messages for insert with check (
  author_id = (select auth.uid())
  and exists (
    select 1 from public.plan_inbox_threads t
    join public.rsvp_requests r on r.event_id = t.event_id
    where t.id = thread_id
      and r.profile_id = (select auth.uid())
      and r.status in ('requested', 'accepted', 'confirmed', 'waitlisted')
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'creator-verification-documents',
  'creator-verification-documents',
  false,
  10485760,
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do nothing;

create policy "profiles upload own creator verification documents"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'creator-verification-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "profiles read own creator verification documents"
on storage.objects for select
to authenticated
using (
  bucket_id = 'creator-verification-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "profiles update own creator verification documents"
on storage.objects for update
to authenticated
using (
  bucket_id = 'creator-verification-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'creator-verification-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
