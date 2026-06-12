insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-covers',
  'event-covers',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = true,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "public read event covers"
on storage.objects for select
to public
using (bucket_id = 'event-covers');

create policy "profiles upload own event covers"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'event-covers'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "profiles update own event covers"
on storage.objects for update
to authenticated
using (
  bucket_id = 'event-covers'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'event-covers'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
