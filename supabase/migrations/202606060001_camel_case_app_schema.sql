-- Rename Hausy-owned schema objects to camelCase.
-- Supabase Auth and Storage keep their platform-defined names.

do $$
declare
  pair text[];
begin
  foreach pair slice 1 in array array[
    array['discovery_markets', 'discoveryMarkets'],
    array['discovery_tags', 'discoveryTags'],
    array['creator_templates', 'creatorTemplates'],
    array['creator_verification_documents', 'creatorVerificationDocuments'],
    array['event_sessions', 'eventSessions'],
    array['event_checkpoints', 'eventCheckpoints'],
    array['event_tags', 'eventTags'],
    array['event_prompts', 'eventPrompts'],
    array['event_attendee_previews', 'eventAttendeePreviews'],
    array['creator_credentials', 'creatorCredentials'],
    array['creator_links', 'creatorLinks'],
    array['event_interest', 'eventInterest'],
    array['saved_events', 'savedEvents'],
    array['rsvp_requests', 'rsvpRequests'],
    array['attendance_records', 'attendanceRecords'],
    array['profile_follows', 'profileFollows'],
    array['creator_follows', 'creatorFollows'],
    array['user_connections', 'userConnections'],
    array['plan_inbox_threads', 'planInboxThreads'],
    array['plan_inbox_messages', 'planInboxMessages']
  ] loop
    if to_regclass(format('public.%I', pair[1])) is not null
      and to_regclass(format('public.%I', pair[2])) is null then
      execute format('alter table public.%I rename to %I', pair[1], pair[2]);
    end if;
  end loop;
end $$;

do $$
declare
  item text[];
begin
  foreach item slice 1 in array array[
    array['profiles', 'display_name', 'displayName'],
    array['profiles', 'avatar_url', 'avatarUrl'],
    array['profiles', 'created_at', 'createdAt'],
    array['profiles', 'updated_at', 'updatedAt'],
    array['creators', 'profile_id', 'profileId'],
    array['creators', 'display_name', 'displayName'],
    array['creators', 'community_tone', 'communityTone'],
    array['creators', 'submitted_at', 'submittedAt'],
    array['creators', 'reviewed_at', 'reviewedAt'],
    array['creators', 'reviewed_by', 'reviewedBy'],
    array['creators', 'review_note', 'reviewNote'],
    array['creators', 'paused_at', 'pausedAt'],
    array['creators', 'repeat_rate', 'repeatRate'],
    array['creators', 'past_events', 'pastEvents'],
    array['creators', 'recurring_attendees', 'recurringAttendees'],
    array['creators', 'created_at', 'createdAt'],
    array['creators', 'updated_at', 'updatedAt'],
    array['creatorVerificationDocuments', 'creator_id', 'creatorId'],
    array['creatorVerificationDocuments', 'document_type', 'documentType'],
    array['creatorVerificationDocuments', 'storage_path', 'storagePath'],
    array['creatorVerificationDocuments', 'reviewed_by', 'reviewedBy'],
    array['creatorVerificationDocuments', 'reviewed_at', 'reviewedAt'],
    array['creatorVerificationDocuments', 'rejection_reason', 'rejectionReason'],
    array['creatorVerificationDocuments', 'uploaded_at', 'uploadedAt'],
    array['venues', 'address_line', 'addressLine'],
    array['venues', 'map_url', 'mapUrl'],
    array['venues', 'created_by', 'createdBy'],
    array['venues', 'created_at', 'createdAt'],
    array['venues', 'updated_at', 'updatedAt'],
    array['events', 'creator_id', 'creatorId'],
    array['events', 'venue_id', 'venueId'],
    array['events', 'image_url', 'imageUrl'],
    array['events', 'poster_text', 'posterText'],
    array['events', 'price_label', 'priceLabel'],
    array['events', 'deposit_required', 'depositRequired'],
    array['events', 'deposit_amount', 'depositAmount'],
    array['events', 'created_at', 'createdAt'],
    array['events', 'updated_at', 'updatedAt'],
    array['eventSessions', 'event_id', 'eventId'],
    array['eventSessions', 'starts_at', 'startsAt'],
    array['eventSessions', 'ends_at', 'endsAt'],
    array['eventSessions', 'created_at', 'createdAt'],
    array['eventCheckpoints', 'event_id', 'eventId'],
    array['eventCheckpoints', 'verified_at', 'verifiedAt'],
    array['eventCheckpoints', 'created_at', 'createdAt'],
    array['eventTags', 'event_id', 'eventId'],
    array['eventPrompts', 'event_id', 'eventId'],
    array['eventAttendeePreviews', 'event_id', 'eventId'],
    array['eventAttendeePreviews', 'display_name', 'displayName'],
    array['creatorCredentials', 'creator_id', 'creatorId'],
    array['creatorLinks', 'creator_id', 'creatorId'],
    array['reviews', 'event_id', 'eventId'],
    array['reviews', 'creator_id', 'creatorId'],
    array['reviews', 'reviewer_id', 'reviewerId'],
    array['reviews', 'created_at', 'createdAt'],
    array['eventInterest', 'profile_id', 'profileId'],
    array['eventInterest', 'event_id', 'eventId'],
    array['eventInterest', 'created_at', 'createdAt'],
    array['savedEvents', 'profile_id', 'profileId'],
    array['savedEvents', 'event_id', 'eventId'],
    array['savedEvents', 'created_at', 'createdAt'],
    array['rsvpRequests', 'profile_id', 'profileId'],
    array['rsvpRequests', 'event_id', 'eventId'],
    array['rsvpRequests', 'session_id', 'sessionId'],
    array['rsvpRequests', 'reviewed_by', 'reviewedBy'],
    array['rsvpRequests', 'reviewed_at', 'reviewedAt'],
    array['rsvpRequests', 'created_at', 'createdAt'],
    array['rsvpRequests', 'updated_at', 'updatedAt'],
    array['attendanceRecords', 'profile_id', 'profileId'],
    array['attendanceRecords', 'event_id', 'eventId'],
    array['attendanceRecords', 'session_id', 'sessionId'],
    array['attendanceRecords', 'rsvp_request_id', 'rsvpRequestId'],
    array['attendanceRecords', 'recorded_at', 'recordedAt'],
    array['profileFollows', 'follower_id', 'followerId'],
    array['profileFollows', 'following_id', 'followingId'],
    array['profileFollows', 'created_at', 'createdAt'],
    array['creatorFollows', 'profile_id', 'profileId'],
    array['creatorFollows', 'creator_id', 'creatorId'],
    array['creatorFollows', 'created_at', 'createdAt'],
    array['userConnections', 'requester_id', 'requesterId'],
    array['userConnections', 'recipient_id', 'recipientId'],
    array['userConnections', 'created_at', 'createdAt'],
    array['userConnections', 'updated_at', 'updatedAt'],
    array['planInboxThreads', 'event_id', 'eventId'],
    array['planInboxThreads', 'created_at', 'createdAt'],
    array['planInboxThreads', 'updated_at', 'updatedAt'],
    array['planInboxMessages', 'thread_id', 'threadId'],
    array['planInboxMessages', 'author_id', 'authorId'],
    array['planInboxMessages', 'created_at', 'createdAt']
  ] loop
    if to_regclass(format('public.%I', item[1])) is not null
      and exists (
        select 1 from information_schema.columns
        where table_schema = 'public' and table_name = item[1] and column_name = item[2]
      )
      and not exists (
        select 1 from information_schema.columns
        where table_schema = 'public' and table_name = item[1] and column_name = item[3]
      ) then
      execute format('alter table public.%I rename column %I to %I', item[1], item[2], item[3]);
    end if;
  end loop;
end $$;

do $$
declare
  item text[];
begin
  foreach item slice 1 in array array[
    array['creator_status', 'in_review', 'inReview'],
    array['event_status', 'in_review', 'inReview'],
    array['attendance_status', 'no_show', 'noShow'],
    array['event_checkpoint_kind', 'venue_verified', 'venueVerified'],
    array['event_checkpoint_kind', 'route_proof_added', 'routeProofAdded'],
    array['event_checkpoint_kind', 'guest_list_reviewed', 'guestListReviewed'],
    array['event_checkpoint_kind', 'creator_confirmed', 'creatorConfirmed'],
    array['message_kind', 'host_update', 'hostUpdate'],
    array['message_kind', 'rsvp_status', 'rsvpStatus']
  ] loop
    if exists (
      select 1
      from pg_type t
      join pg_enum e on e.enumtypid = t.oid
      join pg_namespace n on n.oid = t.typnamespace
      where n.nspname = 'public' and t.typname = item[1] and e.enumlabel = item[2]
    ) and not exists (
      select 1
      from pg_type t
      join pg_enum e on e.enumtypid = t.oid
      join pg_namespace n on n.oid = t.typnamespace
      where n.nspname = 'public' and t.typname = item[1] and e.enumlabel = item[3]
    ) then
      execute format('alter type public.%I rename value %L to %L', item[1], item[2], item[3]);
    end if;
  end loop;
end $$;

do $$
declare
  pair text[];
begin
  foreach pair slice 1 in array array[
    array['creator_status', 'creatorStatus'],
    array['verification_document_status', 'verificationDocumentStatus'],
    array['venue_status', 'venueStatus'],
    array['event_status', 'eventStatus'],
    array['event_checkpoint_kind', 'eventCheckpointKind'],
    array['interest_status', 'interestStatus'],
    array['rsvp_status', 'rsvpStatus'],
    array['attendance_status', 'attendanceStatus'],
    array['connection_status', 'connectionStatus'],
    array['thread_status', 'threadStatus'],
    array['message_kind', 'messageKind']
  ] loop
    if exists (
      select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
      where n.nspname = 'public' and t.typname = pair[1]
    ) and not exists (
      select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
      where n.nspname = 'public' and t.typname = pair[2]
    ) then
      execute format('alter type public.%I rename to %I', pair[1], pair[2]);
    end if;
  end loop;
end $$;

do $$
begin
  if exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'handle_new_user'
  ) and not exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'handleNewUser'
  ) then
    alter function public.handle_new_user() rename to "handleNewUser";
  end if;
end $$;

create or replace function public."handleNewUser"()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, "displayName", handle, "avatarUrl")
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
