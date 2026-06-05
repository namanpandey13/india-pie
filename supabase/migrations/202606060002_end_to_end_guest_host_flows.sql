-- End-to-end guest and host operations for the camelCase app schema.

create table if not exists public."appNotifications" (
  id uuid primary key default gen_random_uuid(),
  "profileId" uuid not null references public.profiles(id) on delete cascade,
  "eventId" uuid references public.events(id) on delete cascade,
  "actorId" uuid references public.profiles(id) on delete set null,
  kind text not null check (kind in ('rsvpAccepted', 'rsvpDeclined', 'eventConfirmed', 'eventCancelled', 'announcement', 'ticketIssued')),
  title text not null,
  body text not null,
  "readAt" timestamptz,
  "createdAt" timestamptz not null default now()
);

create table if not exists public."eventTickets" (
  id uuid primary key default gen_random_uuid(),
  "rsvpRequestId" uuid not null unique references public."rsvpRequests"(id) on delete cascade,
  "profileId" uuid not null references public.profiles(id) on delete cascade,
  "eventId" uuid not null references public.events(id) on delete cascade,
  "ticketCode" text not null unique,
  status text not null default 'active' check (status in ('active', 'cancelled', 'used')),
  "issuedAt" timestamptz not null default now()
);

create index if not exists appNotificationsProfileCreatedIdx on public."appNotifications" ("profileId", "createdAt" desc);
create index if not exists appNotificationsEventIdx on public."appNotifications" ("eventId");
create index if not exists eventTicketsProfileIdx on public."eventTickets" ("profileId", status);
create index if not exists eventTicketsEventIdx on public."eventTickets" ("eventId", status);

alter table public."appNotifications" enable row level security;
alter table public."eventTickets" enable row level security;

drop policy if exists "profiles read own notifications" on public."appNotifications";
create policy "profiles read own notifications" on public."appNotifications"
for select using ("profileId" = (select auth.uid()));

drop policy if exists "hosts notify guests for own events" on public."appNotifications";
create policy "hosts notify guests for own events" on public."appNotifications"
for insert with check (
  "actorId" = (select auth.uid())
  and exists (
    select 1
    from public.events e
    join public.creators c on c.id = e."creatorId"
    where e.id = "eventId" and c."profileId" = (select auth.uid())
  )
);

drop policy if exists "profiles update own notification reads" on public."appNotifications";
create policy "profiles update own notification reads" on public."appNotifications"
for update using ("profileId" = (select auth.uid()))
with check ("profileId" = (select auth.uid()));

drop policy if exists "profiles read own tickets" on public."eventTickets";
create policy "profiles read own tickets" on public."eventTickets"
for select using ("profileId" = (select auth.uid()));

drop policy if exists "hosts read own event tickets" on public."eventTickets";
create policy "hosts read own event tickets" on public."eventTickets"
for select using (
  exists (
    select 1
    from public.events e
    join public.creators c on c.id = e."creatorId"
    where e.id = "eventId" and c."profileId" = (select auth.uid())
  )
);

drop policy if exists "hosts issue tickets for own events" on public."eventTickets";
create policy "hosts issue tickets for own events" on public."eventTickets"
for insert with check (
  exists (
    select 1
    from public.events e
    join public.creators c on c.id = e."creatorId"
    where e.id = "eventId" and c."profileId" = (select auth.uid())
  )
);

drop policy if exists "hosts manage own event sessions" on public."eventSessions";
create policy "hosts manage own event sessions" on public."eventSessions"
for all using (
  exists (
    select 1
    from public.events e
    join public.creators c on c.id = e."creatorId"
    where e.id = "eventId" and c."profileId" = (select auth.uid())
  )
) with check (
  exists (
    select 1
    from public.events e
    join public.creators c on c.id = e."creatorId"
    where e.id = "eventId" and c."profileId" = (select auth.uid())
  )
);

drop policy if exists "hosts read own event rsvps" on public."rsvpRequests";
create policy "hosts read own event rsvps" on public."rsvpRequests"
for select using (
  exists (
    select 1
    from public.events e
    join public.creators c on c.id = e."creatorId"
    where e.id = "eventId" and c."profileId" = (select auth.uid())
  )
);

drop policy if exists "hosts decide own event rsvps" on public."rsvpRequests";
create policy "hosts decide own event rsvps" on public."rsvpRequests"
for update using (
  exists (
    select 1
    from public.events e
    join public.creators c on c.id = e."creatorId"
    where e.id = "eventId" and c."profileId" = (select auth.uid())
  )
) with check (
  exists (
    select 1
    from public.events e
    join public.creators c on c.id = e."creatorId"
    where e.id = "eventId" and c."profileId" = (select auth.uid())
  )
);

drop policy if exists "hosts read own plan threads" on public."planInboxThreads";
create policy "hosts read own plan threads" on public."planInboxThreads"
for select using (
  exists (
    select 1
    from public.events e
    join public.creators c on c.id = e."creatorId"
    where e.id = "eventId" and c."profileId" = (select auth.uid())
  )
);

drop policy if exists "hosts create own plan threads" on public."planInboxThreads";
create policy "hosts create own plan threads" on public."planInboxThreads"
for insert with check (
  exists (
    select 1
    from public.events e
    join public.creators c on c.id = e."creatorId"
    where e.id = "eventId" and c."profileId" = (select auth.uid())
  )
);

drop policy if exists "hosts create own plan messages" on public."planInboxMessages";
create policy "hosts create own plan messages" on public."planInboxMessages"
for insert with check (
  "authorId" = (select auth.uid())
  and exists (
    select 1
    from public."planInboxThreads" t
    join public.events e on e.id = t."eventId"
    join public.creators c on c.id = e."creatorId"
    where t.id = "threadId" and c."profileId" = (select auth.uid())
  )
);

drop policy if exists "hosts read own plan messages" on public."planInboxMessages";
create policy "hosts read own plan messages" on public."planInboxMessages"
for select using (
  exists (
    select 1
    from public."planInboxThreads" t
    join public.events e on e.id = t."eventId"
    join public.creators c on c.id = e."creatorId"
    where t.id = "threadId" and c."profileId" = (select auth.uid())
  )
);
