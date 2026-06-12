alter table public.events
  add column if not exists "seriesKey" text,
  add column if not exists "occurrenceNumber" integer;

update public.events
set
  "seriesKey" = coalesce(
    "seriesKey",
    trim(both '-' from regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g'))
  ),
  "occurrenceNumber" = coalesce("occurrenceNumber", 1);

with ranked as (
  select
    id,
    row_number() over (
      partition by "seriesKey"
      order by "createdAt" asc, id asc
    ) as edition
  from public.events
)
update public.events as events
set "occurrenceNumber" = ranked.edition
from ranked
where events.id = ranked.id;

with single_editions as (
  select "seriesKey"
  from public.events
  group by "seriesKey"
  having count(*) = 1
)
update public.events
set "occurrenceNumber" = case title
  when 'Sunday Coffee Club' then 5
  when 'Founders Who Cook' then 3
  when 'Quiet Reading Party' then 2
  else "occurrenceNumber"
end
where "seriesKey" in (select "seriesKey" from single_editions);

alter table public.events
  alter column "seriesKey" set not null,
  alter column "occurrenceNumber" set default 1,
  alter column "occurrenceNumber" set not null;

alter table public.events
  drop constraint if exists events_occurrence_number_check;

alter table public.events
  add constraint events_occurrence_number_check check ("occurrenceNumber" > 0);

create unique index if not exists events_series_occurrence_unique
  on public.events ("seriesKey", "occurrenceNumber");
