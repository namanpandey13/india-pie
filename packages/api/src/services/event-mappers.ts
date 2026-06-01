import type {
  AccentTone,
  Attendee,
  CreatorProfile,
  Event,
  EventCategory,
  EventCheckpoint,
  EventStatus,
  HostProfile,
  Organizer,
  VenueStatus,
} from '@hausy/types';

export type CreatorRow = {
  id: string;
  profile_id: string;
  handle: string;
  display_name: string;
  title: string;
  bio: string;
  philosophy: string | null;
  community_tone: string | null;
  rating: number | string | null;
  repeat_rate: number | string | null;
  past_events: number | null;
  recurring_attendees: number | null;
  status: string;
};

export type CreatorCredentialRow = {
  creator_id: string;
  label: string;
};

export type CreatorLinkRow = {
  creator_id: string;
  label: string;
};

export type VenueRow = {
  id: string;
  name: string;
  locality: string;
  city: string;
  status: string;
};

export type EventRow = {
  id: string;
  creator_id: string;
  venue_id: string;
  title: string;
  category: string;
  image_url: string | null;
  poster_text: string | null;
  price_label: string;
  vibe: string;
  about: string;
  capacity: number;
  status: string;
};

export type EventSessionRow = {
  id: string;
  event_id: string;
  starts_at: string;
  capacity: number;
};

export type EventCheckpointRow = {
  id: string;
  event_id: string;
  kind: string;
  label: string;
  verified_at: string | null;
};

export type EventTagRow = {
  event_id: string;
  tag: string;
};

export type EventPromptRow = {
  event_id: string;
  prompt: string;
};

export type EventAttendeePreviewRow = {
  id: string;
  event_id: string;
  display_name: string;
  role: string;
  signal: string;
  status: string;
  initials: string;
  accent: string;
};

export function mapEventRow(input: {
  attendeePreviews: EventAttendeePreviewRow[];
  checkpoints: EventCheckpointRow[];
  creator: CreatorRow;
  creatorCredentials: CreatorCredentialRow[];
  creatorLinks: CreatorLinkRow[];
  event: EventRow;
  prompts: EventPromptRow[];
  session: EventSessionRow | null;
  tags: EventTagRow[];
  venue: VenueRow;
}): Event {
  if (!input.event.image_url) {
    throw new Error(`Event ${input.event.id} is missing image_url`);
  }

  const session = input.session;
  const organizer = mapOrganizer(input.creator, input.creatorLinks);
  const checkpoints = input.checkpoints.map(mapCheckpoint);

  return {
    id: input.event.id,
    status: normalizeEventStatus(input.event.status),
    title: input.event.title,
    locality: input.venue.locality,
    venue: {
      id: input.venue.id,
      name: input.venue.name,
      locality: input.venue.locality,
      city: input.venue.city,
      status: normalizeVenueStatus(input.venue.status),
    },
    dateLabel: session ? formatDateLabel(session.starts_at) : 'Date pending',
    timeLabel: session ? formatTimeLabel(session.starts_at) : 'Time pending',
    priceLabel: input.event.price_label,
    category: normalizeEventCategory(input.event.category),
    image: input.event.image_url,
    posterText: input.event.poster_text ?? input.event.title.toUpperCase(),
    organizer,
    attendees: input.attendeePreviews.map(mapAttendee),
    capacity: input.event.capacity,
    tags: input.tags.map((tag) => tag.tag),
    vibe: input.event.vibe,
    about: input.event.about,
    checkpoints,
    prompts: input.prompts.map((prompt) => prompt.prompt),
    friendContext: summarizeAttendeeContext(input.attendeePreviews),
  };
}

export function mapHostProfile(
  creator: CreatorRow,
  links: CreatorLinkRow[] = [],
  credentials: CreatorCredentialRow[] = [],
): HostProfile {
  const organizer = mapOrganizer(creator, links);

  return {
    ...organizer,
    philosophy: creator.philosophy ?? 'Clear expectations, small rooms, and a respectful crowd.',
    communityTone: creator.community_tone ?? 'Creator-led and trust-first.',
    pastEvents: creator.past_events ?? 0,
    recurringAttendees: creator.recurring_attendees ?? 0,
    credentials: credentials.map((credential) => credential.label),
  };
}

export function mapCreatorProfile(
  creator: CreatorRow,
  links: CreatorLinkRow[] = [],
  credentials: CreatorCredentialRow[] = [],
): CreatorProfile {
  return {
    ...mapHostProfile(creator, links, credentials),
    handle: creator.handle,
    status:
      creator.status === 'draft' ||
      creator.status === 'in_review' ||
      creator.status === 'approved' ||
      creator.status === 'paused' ||
      creator.status === 'rejected'
        ? creator.status
        : 'draft',
    userId: creator.profile_id,
  };
}

function mapOrganizer(creator: CreatorRow, links: CreatorLinkRow[] = []): Organizer {
  return {
    id: creator.id,
    name: creator.display_name,
    title: creator.title,
    bio: creator.bio,
    rating: formatRating(creator.rating),
    repeatRate: formatPercent(creator.repeat_rate),
    links: links.map((link) => link.label),
    initials: initialsFor(creator.display_name),
    color: 'violet',
  };
}

function mapAttendee(attendee: EventAttendeePreviewRow): Attendee {
  return {
    id: attendee.id,
    name: attendee.display_name,
    role: attendee.role,
    signal: attendee.signal,
    status: attendee.status === 'accepted' || attendee.status === 'confirmed' ? attendee.status : 'interested',
    initials: attendee.initials,
    color: normalizeAccent(attendee.accent),
  };
}

function mapCheckpoint(checkpoint: EventCheckpointRow): EventCheckpoint {
  return {
    id: checkpoint.id,
    eventId: checkpoint.event_id,
    kind:
      checkpoint.kind === 'route_proof_added' ||
      checkpoint.kind === 'guest_list_reviewed' ||
      checkpoint.kind === 'creator_confirmed'
        ? checkpoint.kind
        : 'venue_verified',
    label: checkpoint.label,
    verifiedAt: checkpoint.verified_at,
  };
}

function normalizeEventCategory(category: string): EventCategory {
  if (category === 'coffee' || category === 'culture' || category === 'founders' || category === 'sports' || category === 'music') {
    return category;
  }

  return 'culture';
}

function normalizeEventStatus(status: string): EventStatus {
  if (
    status === 'draft' ||
    status === 'in_review' ||
    status === 'planning' ||
    status === 'confirmed' ||
    status === 'cancelled' ||
    status === 'completed'
  ) {
    return status;
  }

  return 'planning';
}

function normalizeVenueStatus(status: string): VenueStatus {
  if (status === 'verified' || status === 'restricted') {
    return status;
  }

  return 'unverified';
}

function normalizeAccent(accent: string): AccentTone {
  if (accent === 'lime' || accent === 'blue' || accent === 'yellow' || accent === 'violet') {
    return accent;
  }

  return 'violet';
}

function formatRating(value: number | string | null) {
  if (value === null) {
    return 'New';
  }

  return Number(value).toFixed(1);
}

function formatPercent(value: number | string | null) {
  if (value === null) {
    return '0%';
  }

  return `${Math.round(Number(value))}%`;
}

function initialsFor(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    weekday: 'short',
  }).format(new Date(value));
}

function formatTimeLabel(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function summarizeAttendeeContext(attendees: EventAttendeePreviewRow[]) {
  const confirmed = attendees.filter((attendee) => attendee.status === 'confirmed').length;

  if (confirmed > 0) {
    return `${confirmed} confirmed attendee${confirmed === 1 ? '' : 's'} visible`;
  }

  return 'Attendee mix opens after creator review';
}
