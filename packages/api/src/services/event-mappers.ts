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
  profileId: string;
  handle: string;
  displayName: string;
  title: string;
  bio: string;
  philosophy: string | null;
  communityTone: string | null;
  rating: number | string | null;
  repeatRate: number | string | null;
  pastEvents: number | null;
  recurringAttendees: number | null;
  status: string;
};

export type ProfileAvatarRow = {
  id: string;
  avatarUrl: string | null;
};

export type CreatorCredentialRow = {
  creatorId: string;
  label: string;
};

export type CreatorLinkRow = {
  creatorId: string;
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
  seriesKey: string;
  occurrenceNumber: number;
  creatorId: string;
  venueId: string;
  title: string;
  category: string;
  imageUrl: string | null;
  posterText: string | null;
  priceLabel: string;
  vibe: string;
  about: string;
  capacity: number;
  status: string;
};

export type EventSessionRow = {
  id: string;
  eventId: string;
  startsAt: string;
  capacity: number;
};

export type EventCheckpointRow = {
  id: string;
  eventId: string;
  kind: string;
  label: string;
  verifiedAt: string | null;
};

export type EventTagRow = {
  eventId: string;
  tag: string;
};

export type EventPromptRow = {
  eventId: string;
  prompt: string;
};

export type EventAttendeePreviewRow = {
  id: string;
  avatarUrl: string | null;
  eventId: string;
  displayName: string;
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
  creatorAvatarUrl?: string | null;
  creatorCredentials: CreatorCredentialRow[];
  creatorLinks: CreatorLinkRow[];
  event: EventRow;
  prompts: EventPromptRow[];
  session: EventSessionRow | null;
  tags: EventTagRow[];
  venue: VenueRow;
}): Event {
  if (!input.event.imageUrl) {
    throw new Error(`Event ${input.event.id} is missing imageUrl`);
  }

  const session = input.session;
  const organizer = mapOrganizer(input.creator, input.creatorLinks, input.creatorAvatarUrl);
  const checkpoints = input.checkpoints.map(mapCheckpoint);

  return {
    id: input.event.id,
    seriesKey: input.event.seriesKey,
    occurrenceNumber: input.event.occurrenceNumber,
    previousOccurrences: Math.max(input.event.occurrenceNumber - 1, 0),
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
    dateLabel: session ? formatDateLabel(session.startsAt) : 'Date pending',
    timeLabel: session ? formatTimeLabel(session.startsAt) : 'Time pending',
    priceLabel: input.event.priceLabel,
    category: normalizeEventCategory(input.event.category),
    image: input.event.imageUrl,
    posterText: input.event.posterText ?? input.event.title.toUpperCase(),
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
  avatarUrl: string | null = null,
): HostProfile {
  const organizer = mapOrganizer(creator, links, avatarUrl);

  return {
    ...organizer,
    philosophy: creator.philosophy ?? 'Clear expectations, small rooms, and a respectful crowd.',
    communityTone: creator.communityTone ?? 'Creator-led and trust-first.',
    pastEvents: creator.pastEvents ?? 0,
    recurringAttendees: creator.recurringAttendees ?? 0,
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
      creator.status === 'inReview' ||
      creator.status === 'approved' ||
      creator.status === 'paused' ||
      creator.status === 'rejected'
        ? creator.status
        : 'draft',
    userId: creator.profileId,
  };
}

function mapOrganizer(
  creator: CreatorRow,
  links: CreatorLinkRow[] = [],
  avatarUrl: string | null = null,
): Organizer {
  return {
    id: creator.id,
    avatarUrl,
    name: creator.displayName,
    title: creator.title,
    bio: creator.bio,
    rating: formatRating(creator.rating),
    repeatRate: formatPercent(creator.repeatRate),
    links: links.map((link) => link.label),
    initials: initialsFor(creator.displayName),
    color: 'violet',
  };
}

function mapAttendee(attendee: EventAttendeePreviewRow): Attendee {
  return {
    id: attendee.id,
    avatarUrl: attendee.avatarUrl,
    name: attendee.displayName,
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
    eventId: checkpoint.eventId,
    kind:
      checkpoint.kind === 'routeProofAdded' ||
      checkpoint.kind === 'guestListReviewed' ||
      checkpoint.kind === 'creatorConfirmed'
        ? checkpoint.kind
        : 'venueVerified',
    label: checkpoint.label,
    verifiedAt: checkpoint.verifiedAt,
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
    status === 'inReview' ||
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
