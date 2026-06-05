-- Local/staging seed data for exercising the launch MVP end to end.
-- Do not run this file against production.

create extension if not exists "pgcrypto";

insert into public."discoveryMarkets" (id, label, active, position)
values ('delhi-ncr', 'Delhi NCR', true, 1)
on conflict (id) do update
set
  active = excluded.active,
  label = excluded.label,
  position = excluded.position;

insert into public."discoveryTags" (id, label, active, position)
values
  ('for-you', 'For You', true, 1),
  ('tonight', 'Tonight', true, 2),
  ('new', 'New', true, 3),
  ('coffee', 'Coffee', true, 4),
  ('music', 'Music', true, 5),
  ('workshops', 'Workshops', true, 6)
on conflict (id) do update
set
  active = excluded.active,
  label = excluded.label,
  position = excluded.position;

insert into public."creatorTemplates" (id, label, active, position)
values
  ('game-night', 'game night', true, 1),
  ('photo-walk', 'photo walk', true, 2),
  ('builders-dinner', 'builders dinner', true, 3),
  ('listening-party', 'listening party', true, 4)
on conflict (id) do update
set
  active = excluded.active,
  label = excluded.label,
  position = excluded.position;

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'tara.creator@hausy.local',
    crypt('hausy-local-only', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Tara Singh"}'::jsonb,
    now(),
    now()
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'zoya.creator@hausy.local',
    crypt('hausy-local-only', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Zoya Khan"}'::jsonb,
    now(),
    now()
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'dev.creator@hausy.local',
    crypt('hausy-local-only', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Dev Arora"}'::jsonb,
    now(),
    now()
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'riya.member@hausy.local',
    crypt('hausy-local-only', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Riya Malhotra"}'::jsonb,
    now(),
    now()
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'arjun.member@hausy.local',
    crypt('hausy-local-only', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Arjun Bedi"}'::jsonb,
    now(),
    now()
  ),
  (
    '66666666-6666-4666-8666-666666666666',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'mehak.member@hausy.local',
    crypt('hausy-local-only', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Mehak Jain"}'::jsonb,
    now(),
    now()
  )
on conflict (id) do update
set
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = now();

insert into public.profiles (id, "displayName", handle, city, bio, instagram, linkedin)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'Tara Singh',
    'tara-games',
    'Delhi NCR',
    'Small-table game nights with structure before small talk.',
    '@taraplays',
    'linkedin.com/in/tarasingh'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Zoya Khan',
    'zoya-photo',
    'Delhi NCR',
    'Analog photo walks and creator mixers around Delhi.',
    '@zoyashoots',
    'linkedin.com/in/zoyakhan'
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'Dev Arora',
    'dev-builders',
    'Delhi NCR',
    'Founder dinners for operators, indie hackers, and early-stage builders.',
    '@devrooms',
    'linkedin.com/in/devarora'
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    'Riya Malhotra',
    'riya-design',
    'Delhi NCR',
    'Product designer looking for calm offline communities.',
    '@riya.design',
    'linkedin.com/in/riyam'
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    'Arjun Bedi',
    'arjun-builds',
    'Delhi NCR',
    'Founder and repeat board-game attendee.',
    '@arjunbuilds',
    'linkedin.com/in/arjunbedi'
  ),
  (
    '66666666-6666-4666-8666-666666666666',
    'Mehak Jain',
    'mehak-frames',
    'Delhi NCR',
    'Architecture student exploring Delhi through photo walks.',
    '@mehakframes',
    'linkedin.com/in/mehakjain'
  )
on conflict (id) do update
set
  bio = excluded.bio,
  city = excluded.city,
  "displayName" = excluded."displayName",
  handle = excluded.handle,
  instagram = excluded.instagram,
  linkedin = excluded.linkedin,
  "updatedAt" = now();

insert into public.creators (
  id,
  "profileId",
  handle,
  "displayName",
  title,
  bio,
  philosophy,
  "communityTone",
  status,
  "submittedAt",
  "reviewedAt",
  rating,
  "repeatRate",
  "pastEvents",
  "recurringAttendees"
)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '11111111-1111-4111-8111-111111111111',
    'tara-games',
    'Tara Singh',
    'Games curator',
    'Hosts small-table game nights for people who want structure before small talk.',
    'Small tables, clear rules, and gentle prompts so solo guests never feel exposed.',
    'Warm, lightly structured, solo-friendly.',
    'approved',
    now() - interval '20 days',
    now() - interval '18 days',
    4.9,
    72,
    18,
    42
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    '22222222-2222-4222-8222-222222222222',
    'zoya-photo',
    'Zoya Khan',
    'Street photographer',
    'Runs analog photo walks and creator mixers around Delhi.',
    'Move slowly, notice more, and make it easy for strangers to collaborate.',
    'Creative, early, intimate, route-led.',
    'approved',
    now() - interval '18 days',
    now() - interval '16 days',
    4.8,
    64,
    11,
    27
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    '33333333-3333-4333-8333-333333333333',
    'dev-builders',
    'Dev Arora',
    'Community operator',
    'Curates founder dinners for operators, indie hackers, and early-stage people.',
    'Keep the room useful without making it feel transactional.',
    'Curated dinner, not a pitch night.',
    'approved',
    now() - interval '16 days',
    now() - interval '14 days',
    4.7,
    58,
    9,
    21
  )
on conflict (id) do update
set
  bio = excluded.bio,
  "communityTone" = excluded."communityTone",
  "displayName" = excluded."displayName",
  philosophy = excluded.philosophy,
  rating = excluded.rating,
  "repeatRate" = excluded."repeatRate",
  status = excluded.status,
  title = excluded.title,
  "updatedAt" = now();

insert into public."creatorCredentials" ("creatorId", label)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Instagram verified'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'LinkedIn linked'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '18 hosted plans'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Portfolio linked'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Route shared before every walk'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '11 hosted plans'),
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'LinkedIn linked'),
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'Guest list reviewed'),
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'Past host reviews visible')
on conflict ("creatorId", label) do nothing;

insert into public."creatorLinks" ("creatorId", label, url)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Instagram verified', 'https://instagram.com/taraplays'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'LinkedIn linked', 'https://linkedin.com/in/tarasingh'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Instagram verified', 'https://instagram.com/zoyashoots'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Portfolio linked', 'https://zoyakhan.example'),
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'LinkedIn linked', 'https://linkedin.com/in/devarora'),
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'Past host reviews visible', null)
on conflict ("creatorId", label) do update
set url = excluded.url;

insert into public.venues (id, name, locality, city, "addressLine", status, "createdBy")
values
  (
    'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    'Third Wave Coffee',
    'Hauz Khas Village',
    'Delhi NCR',
    'Hauz Khas Village, New Delhi',
    'verified',
    '11111111-1111-4111-8111-111111111111'
  ),
  (
    'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
    'Lodhi Art District',
    'Lodhi Colony',
    'Delhi NCR',
    'Lodhi Colony, New Delhi',
    'verified',
    '22222222-2222-4222-8222-222222222222'
  ),
  (
    'ffffffff-ffff-4fff-8fff-ffffffffffff',
    'Sly Granny',
    'Cyber Hub',
    'Delhi NCR',
    'Cyber Hub, Gurugram',
    'verified',
    '33333333-3333-4333-8333-333333333333'
  )
on conflict (id) do update
set
  "addressLine" = excluded."addressLine",
  locality = excluded.locality,
  name = excluded.name,
  status = excluded.status,
  "updatedAt" = now();

insert into public.events (
  id,
  "creatorId",
  "venueId",
  title,
  category,
  "imageUrl",
  "posterText",
  "priceLabel",
  vibe,
  about,
  capacity,
  status
)
values
  (
    '12121212-1212-4212-8212-121212121212',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    'Board Game Baithak',
    'coffee',
    'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=1200&q=80',
    'BOARD GAME BAITHAK',
    'Free',
    'Easy structure, no awkward cold open.',
    'A low-pressure game night for people who want to meet new people without standing around wondering what to say. Tables rotate every 35 minutes.',
    18,
    'confirmed'
  ),
  (
    '23232323-2323-4232-8232-232323232323',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
    'Lodhi Film Photo Walk',
    'culture',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    'FILM WALK',
    'Rs 299',
    'Creative, early, intimate, route-led.',
    'A slow morning walk through murals and quiet lanes. Bring any camera or just your phone. The creator pairs solo attendees into tiny shooting prompts.',
    14,
    'planning'
  ),
  (
    '34343434-3434-4343-8343-343434343434',
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'ffffffff-ffff-4fff-8fff-ffffffffffff',
    'Gurgaon Builders Dinner',
    'founders',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80',
    'BUILDERS DINNER',
    'Rs 799',
    'Curated dinner, not a pitch night.',
    'A 12-person dinner for people actively building, buying, or selling software in India. Everyone gets a 45-second intro and a warm ask.',
    12,
    'confirmed'
  )
on conflict (id) do update
set
  about = excluded.about,
  capacity = excluded.capacity,
  "imageUrl" = excluded."imageUrl",
  "priceLabel" = excluded."priceLabel",
  status = excluded.status,
  title = excluded.title,
  "updatedAt" = now();

insert into public."eventSessions" (id, "eventId", "startsAt", "endsAt", capacity)
values
  (
    '13131313-1313-4313-8313-131313131313',
    '12121212-1212-4212-8212-121212121212',
    '2026-06-05 19:30:00+05:30',
    '2026-06-05 22:00:00+05:30',
    18
  ),
  (
    '24242424-2424-4242-8242-242424242424',
    '23232323-2323-4232-8232-232323232323',
    '2026-06-07 08:00:00+05:30',
    '2026-06-07 11:00:00+05:30',
    14
  ),
  (
    '35353535-3535-4353-8353-353535353535',
    '34343434-3434-4343-8343-343434343434',
    '2026-06-11 20:15:00+05:30',
    '2026-06-11 22:30:00+05:30',
    12
  )
on conflict (id) do update
set
  capacity = excluded.capacity,
  "endsAt" = excluded."endsAt",
  "startsAt" = excluded."startsAt";

insert into public."eventTags" ("eventId", tag)
values
  ('12121212-1212-4212-8212-121212121212', 'free'),
  ('12121212-1212-4212-8212-121212121212', 'today'),
  ('12121212-1212-4212-8212-121212121212', 'curated'),
  ('23232323-2323-4232-8232-232323232323', 'curated'),
  ('23232323-2323-4232-8232-232323232323', 'creator-led'),
  ('34343434-3434-4343-8343-343434343434', 'curated'),
  ('34343434-3434-4343-8343-343434343434', 'creator-led')
on conflict ("eventId", tag) do nothing;

insert into public."eventPrompts" ("eventId", prompt, position)
values
  ('12121212-1212-4212-8212-121212121212', 'Which game makes you weirdly competitive?', 1),
  ('12121212-1212-4212-8212-121212121212', 'Are you coming solo or with a friend?', 2),
  ('12121212-1212-4212-8212-121212121212', 'What kind of Delhi plan should exist more often?', 3),
  ('23232323-2323-4232-8232-232323232323', 'What do you usually photograph?', 1),
  ('23232323-2323-4232-8232-232323232323', 'Film, phone, or mirrorless?', 2),
  ('23232323-2323-4232-8232-232323232323', 'Coffee after the walk?', 3),
  ('34343434-3434-4343-8343-343434343434', 'What are you building?', 1),
  ('34343434-3434-4343-8343-343434343434', 'What kind of intro would help this month?', 2),
  ('34343434-3434-4343-8343-343434343434', 'Are you hiring, fundraising, or selling?', 3)
on conflict do nothing;

insert into public."eventAttendeePreviews" (id, "eventId", "displayName", role, signal, status, initials, accent)
values
  ('14141414-1414-4414-8414-141414141414', '12121212-1212-4212-8212-121212121212', 'Riya Malhotra', 'Product designer', '2 mutuals, also into Catan', 'confirmed', 'RM', 'violet'),
  ('15151515-1515-4515-8515-151515151515', '12121212-1212-4212-8212-121212121212', 'Arjun Bedi', 'Founder', 'Attended 3 plans', 'confirmed', 'AB', 'violet'),
  ('16161616-1616-4616-8616-161616161616', '12121212-1212-4212-8212-121212121212', 'Isha Sood', 'Journalist', 'Accepted by creator', 'accepted', 'IS', 'violet'),
  ('25252525-2525-4525-8525-252525252525', '23232323-2323-4232-8232-232323232323', 'Neil Kapoor', 'Brand strategist', 'Bringing a point-and-shoot', 'confirmed', 'NK', 'violet'),
  ('26262626-2626-4626-8626-262626262626', '23232323-2323-4232-8232-232323232323', 'Mehak Jain', 'Architecture student', '3 shared interests', 'confirmed', 'MJ', 'violet'),
  ('27272727-2727-4727-8727-272727272727', '23232323-2323-4232-8232-232323232323', 'Advait Rao', 'Creator', 'Accepted by creator', 'accepted', 'AR', 'violet'),
  ('36363636-3636-4636-8636-363636363636', '34343434-3434-4343-8343-343434343434', 'Naina Oberoi', 'AI founder', 'Confirmed', 'confirmed', 'NO', 'violet'),
  ('37373737-3737-4737-8737-373737373737', '34343434-3434-4343-8343-343434343434', 'Samar Virk', 'VC analyst', '2 mutuals', 'confirmed', 'SV', 'violet'),
  ('38383838-3838-4838-8838-383838383838', '34343434-3434-4343-8343-343434343434', 'Tanya Bhasin', 'Growth lead', 'Accepted by creator', 'accepted', 'TB', 'violet')
on conflict (id) do update
set
  role = excluded.role,
  signal = excluded.signal,
  status = excluded.status;

insert into public."eventCheckpoints" (id, "eventId", kind, label, "verifiedAt")
values
  ('17171717-1717-4717-8717-171717171717', '12121212-1212-4212-8212-121212121212', 'venueVerified', 'Venue verified by Hausy', now() - interval '2 days'),
  ('18181818-1818-4818-8818-181818181818', '12121212-1212-4212-8212-121212121212', 'creatorConfirmed', 'Creator confirmed the table plan', now() - interval '2 days'),
  ('19191919-1919-4919-8919-191919191919', '12121212-1212-4212-8212-121212121212', 'guestListReviewed', 'Guest list reviewed for fit', now() - interval '1 day'),
  ('28282828-2828-4828-8828-282828282828', '23232323-2323-4232-8232-232323232323', 'venueVerified', 'Meeting point verified by Hausy', now() - interval '2 days'),
  ('29292929-2929-4929-8929-292929292929', '23232323-2323-4232-8232-232323232323', 'routeProofAdded', 'Route proof added by creator', now() - interval '1 day'),
  ('39393939-3939-4939-8939-393939393939', '34343434-3434-4343-8343-343434343434', 'guestListReviewed', 'Guest list reviewed for builder fit', now() - interval '2 days'),
  ('40404040-4040-4040-8040-404040404040', '34343434-3434-4343-8343-343434343434', 'creatorConfirmed', 'Creator confirmed restaurant table', now() - interval '1 day'),
  ('41414141-4141-4141-8141-414141414141', '34343434-3434-4343-8343-343434343434', 'venueVerified', 'Venue verified by Hausy', now() - interval '1 day')
on conflict ("eventId", kind) do update
set
  label = excluded.label,
  "verifiedAt" = excluded."verifiedAt";

insert into public.reviews (id, "eventId", "reviewerId", "creatorId", body, context)
values
  (
    '51515151-5151-4151-8151-515151515151',
    '12121212-1212-4212-8212-121212121212',
    '44444444-4444-4444-8444-444444444444',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'I came alone and still had people to sit with in the first five minutes. The table rotations made it easy to talk without forcing it.',
    'attended 2 Tara plans'
  ),
  (
    '52525252-5252-4252-8252-525252525252',
    '12121212-1212-4212-8212-121212121212',
    '55555555-5555-4555-8555-555555555555',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'This felt like a recurring room, not a one-off event. I met two people I still play with on weekends.',
    'met 2 repeat attendees'
  ),
  (
    '53535353-5353-4353-8353-535353535353',
    '23232323-2323-4232-8232-232323232323',
    '66666666-6666-4666-8666-666666666666',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'Zoya made the route feel calm and safe. The shooting prompts helped me talk to people without small talk.',
    'first Hausy plan'
  )
on conflict (id) do update
set
  body = excluded.body,
  context = excluded.context;

insert into public."planInboxThreads" (id, "eventId", title, status)
values
  ('61616161-6161-4161-8161-616161616161', '12121212-1212-4212-8212-121212121212', 'Board Game Baithak plan updates', 'open'),
  ('62626262-6262-4262-8262-626262626262', '23232323-2323-4232-8232-232323232323', 'Lodhi Film Photo Walk plan updates', 'open'),
  ('63636363-6363-4363-8363-636363636363', '34343434-3434-4343-8343-343434343434', 'Gurgaon Builders Dinner plan updates', 'open')
on conflict (id) do update
set
  status = excluded.status,
  title = excluded.title;

insert into public."planInboxMessages" (id, "threadId", "authorId", kind, body, "createdAt")
values
  (
    '71717171-7171-4171-8171-717171717171',
    '61616161-6161-4161-8161-616161616161',
    '11111111-1111-4111-8111-111111111111',
    'hostUpdate',
    'I will split tables by game comfort. Solo folks, you are covered.',
    now() - interval '1 day'
  ),
  (
    '72727272-7272-4272-8272-727272727272',
    '62626262-6262-4262-8262-626262626262',
    '22222222-2222-4222-8222-222222222222',
    'hostUpdate',
    'Route and cafe stop will be shared before arrival.',
    now() - interval '1 day'
  ),
  (
    '73737373-7373-4373-8373-737373737373',
    '63636363-6363-4363-8363-636363636363',
    '33333333-3333-4333-8333-333333333333',
    'hostUpdate',
    'Guest list review closes 24 hours before the dinner.',
    now() - interval '1 day'
  )
on conflict (id) do update
set
  body = excluded.body,
  kind = excluded.kind;
