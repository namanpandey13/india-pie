import { z } from 'zod';

export const accentToneSchema = z.enum(['lime', 'coral', 'blue', 'yellow', 'violet']);
export type AccentTone = z.infer<typeof accentToneSchema>;

export const creatorStatusSchema = z.enum(['draft', 'inReview', 'approved', 'paused', 'rejected']);
export type CreatorStatus = z.infer<typeof creatorStatusSchema>;

export const verificationDocumentStatusSchema = z.enum(['uploaded', 'approved', 'rejected']);
export type VerificationDocumentStatus = z.infer<typeof verificationDocumentStatusSchema>;

export const venueStatusSchema = z.enum(['unverified', 'verified', 'restricted']);
export type VenueStatus = z.infer<typeof venueStatusSchema>;

export const eventStatusSchema = z.enum(['draft', 'inReview', 'planning', 'confirmed', 'cancelled', 'completed']);
export type EventStatus = z.infer<typeof eventStatusSchema>;

export const interestStatusSchema = z.enum(['interested', 'withdrawn']);
export type InterestStatus = z.infer<typeof interestStatusSchema>;

export const rsvpStatusSchema = z.enum(['requested', 'accepted', 'confirmed', 'waitlisted', 'declined', 'cancelled']);
export type RsvpStatus = z.infer<typeof rsvpStatusSchema>;

export const attendanceStatusSchema = z.enum(['attended', 'noShow', 'excused']);
export type AttendanceStatus = z.infer<typeof attendanceStatusSchema>;

export const connectionStatusSchema = z.enum(['pending', 'accepted', 'blocked']);
export type ConnectionStatus = z.infer<typeof connectionStatusSchema>;

export const eventCheckpointKindSchema = z.enum([
  'venueVerified',
  'routeProofAdded',
  'guestListReviewed',
  'creatorConfirmed',
]);
export type EventCheckpointKind = z.infer<typeof eventCheckpointKindSchema>;

export const eventStatusLabel: Record<EventStatus, string> = {
  draft: 'Draft',
  inReview: 'In review',
  planning: 'Planning',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  completed: 'Completed',
};

export const rsvpStatusLabel: Record<RsvpStatus, string> = {
  requested: 'Requested',
  accepted: 'Accepted',
  confirmed: 'Confirmed',
  waitlisted: 'Waitlisted',
  declined: 'Declined',
  cancelled: 'Cancelled',
};

export const creatorStatusLabel: Record<CreatorStatus, string> = {
  draft: 'Draft',
  inReview: 'In review',
  approved: 'Approved',
  paused: 'Paused',
  rejected: 'Rejected',
};

export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  retryable: z.boolean().default(false),
});
export type ApiError = z.infer<typeof apiErrorSchema>;

export type ApiResult<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: ApiError;
    };

export const authUserSchema = z.object({
  id: z.string(),
  email: z.string().email().nullable(),
  name: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
});
export type AuthUser = z.infer<typeof authUserSchema>;

export const eventCategorySchema = z.enum(['coffee', 'culture', 'founders', 'sports', 'music']);
export type EventCategory = z.infer<typeof eventCategorySchema>;

export const attendeeSchema = z.object({
  id: z.string(),
  avatarUrl: z.string().url().nullable(),
  name: z.string(),
  role: z.string(),
  signal: z.string(),
  status: z.enum(['interested', 'accepted', 'confirmed']),
  initials: z.string(),
  color: accentToneSchema,
});
export type Attendee = z.infer<typeof attendeeSchema>;

export const venueSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  locality: z.string(),
  city: z.string(),
  status: venueStatusSchema,
});
export type VenueSummary = z.infer<typeof venueSummarySchema>;

export const venueSchema = venueSummarySchema.extend({
  addressLine: z.string().optional(),
  mapUrl: z.string().url().optional(),
});
export type Venue = z.infer<typeof venueSchema>;

export const organizerSchema = z.object({
  id: z.string(),
  avatarUrl: z.string().url().nullable(),
  name: z.string(),
  title: z.string(),
  bio: z.string(),
  rating: z.string(),
  repeatRate: z.string(),
  links: z.array(z.string()),
  initials: z.string(),
  color: accentToneSchema,
});
export type Organizer = z.infer<typeof organizerSchema>;

export const hostProfileSchema = organizerSchema.extend({
  philosophy: z.string(),
  communityTone: z.string(),
  pastEvents: z.number().int().nonnegative(),
  recurringAttendees: z.number().int().nonnegative(),
  credentials: z.array(z.string()),
});
export type HostProfile = z.infer<typeof hostProfileSchema>;

export const creatorProfileSchema = hostProfileSchema.extend({
  userId: z.string(),
  handle: z.string(),
  status: creatorStatusSchema,
  submittedAt: z.string().nullable().optional(),
  reviewedAt: z.string().nullable().optional(),
  reviewedBy: z.string().nullable().optional(),
  reviewNote: z.string().nullable().optional(),
  pausedAt: z.string().nullable().optional(),
});
export type CreatorProfile = z.infer<typeof creatorProfileSchema>;

export const creatorVerificationDocumentSchema = z.object({
  id: z.string(),
  creatorId: z.string(),
  documentType: z.enum(['identity', 'venueProof', 'professionalProof']),
  storagePath: z.string(),
  status: verificationDocumentStatusSchema,
  uploadedAt: z.string(),
});
export type CreatorVerificationDocument = z.infer<typeof creatorVerificationDocumentSchema>;

export const eventSessionSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  dateLabel: z.string(),
  timeLabel: z.string(),
  capacity: z.number().int().positive(),
});
export type EventSession = z.infer<typeof eventSessionSchema>;

export const eventCheckpointSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  kind: eventCheckpointKindSchema,
  label: z.string(),
  verifiedAt: z.string().nullable(),
});
export type EventCheckpoint = z.infer<typeof eventCheckpointSchema>;

export const eventSchema = z.object({
  id: z.string(),
  seriesKey: z.string(),
  occurrenceNumber: z.number().int().positive(),
  previousOccurrences: z.number().int().nonnegative(),
  status: eventStatusSchema,
  title: z.string(),
  locality: z.string(),
  venue: venueSummarySchema,
  dateLabel: z.string(),
  timeLabel: z.string(),
  priceLabel: z.string(),
  category: eventCategorySchema,
  image: z.string().url(),
  posterText: z.string(),
  organizer: organizerSchema,
  attendees: z.array(attendeeSchema),
  capacity: z.number().int().positive(),
  tags: z.array(z.string()),
  vibe: z.string(),
  about: z.string(),
  checkpoints: z.array(eventCheckpointSchema),
  prompts: z.array(z.string()),
  friendContext: z.string(),
});
export type Event = z.infer<typeof eventSchema>;

export const eventCardDtoSchema = eventSchema.pick({
  id: true,
  seriesKey: true,
  occurrenceNumber: true,
  previousOccurrences: true,
  status: true,
  title: true,
  locality: true,
  venue: true,
  dateLabel: true,
  timeLabel: true,
  priceLabel: true,
  category: true,
  image: true,
  posterText: true,
  organizer: true,
  attendees: true,
  capacity: true,
});
export type EventCardDto = z.infer<typeof eventCardDtoSchema>;

export const eventDetailDtoSchema = eventSchema;
export type EventDetailDto = z.infer<typeof eventDetailDtoSchema>;

export const reviewSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  hostId: z.string(),
  reviewerName: z.string(),
  reviewerInitials: z.string(),
  tone: accentToneSchema,
  body: z.string(),
  context: z.string(),
});
export type Review = z.infer<typeof reviewSchema>;

export const savedEventSchema = z.object({
  userId: z.string(),
  eventId: z.string(),
});
export type SavedEvent = z.infer<typeof savedEventSchema>;

export const rsvpRequestSchema = z.object({
  id: z.string(),
  userId: z.string(),
  eventId: z.string(),
  guestName: z.string().optional(),
  guestInitials: z.string().optional(),
  guestCity: z.string().optional(),
  guestBio: z.string().optional(),
  guestInstagram: z.string().optional(),
  guestLinkedin: z.string().optional(),
  sessionId: z.string().optional(),
  status: rsvpStatusSchema,
  note: z.string().optional(),
});
export type RsvpRequest = z.infer<typeof rsvpRequestSchema>;

export const eventTicketSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  eventTitle: z.string(),
  status: z.enum(['active', 'cancelled', 'used']),
  ticketCode: z.string(),
  issuedAt: z.string(),
});
export type EventTicket = z.infer<typeof eventTicketSchema>;

export const appNotificationSchema = z.object({
  id: z.string(),
  eventId: z.string().nullable(),
  title: z.string(),
  body: z.string(),
  kind: z.enum(['rsvpAccepted', 'rsvpDeclined', 'eventConfirmed', 'eventCancelled', 'announcement', 'ticketIssued']),
  createdAt: z.string(),
  readAt: z.string().nullable(),
});
export type AppNotification = z.infer<typeof appNotificationSchema>;

export const eventInterestSchema = z.object({
  userId: z.string(),
  eventId: z.string(),
  status: interestStatusSchema,
});
export type EventInterest = z.infer<typeof eventInterestSchema>;

export const attendanceRecordSchema = z.object({
  id: z.string(),
  userId: z.string(),
  eventId: z.string(),
  sessionId: z.string().optional(),
  status: attendanceStatusSchema,
});
export type AttendanceRecord = z.infer<typeof attendanceRecordSchema>;

export const planInboxMessageSchema = z.object({
  id: z.string(),
  threadId: z.string(),
  authorId: z.string(),
  body: z.string(),
  createdAt: z.string(),
  kind: z.enum(['hostUpdate', 'rsvpStatus', 'message']),
});
export type PlanInboxMessage = z.infer<typeof planInboxMessageSchema>;

export const planInboxThreadSchema = z.object({
  id: z.string(),
  eventId: z.string().nullable(),
  title: z.string(),
  status: z.enum(['open', 'archived']),
  unreadCount: z.number().int().nonnegative(),
  messages: z.array(planInboxMessageSchema),
});
export type PlanInboxThread = z.infer<typeof planInboxThreadSchema>;

export const userConnectionSchema = z.object({
  requesterId: z.string(),
  recipientId: z.string(),
  status: connectionStatusSchema,
});
export type UserConnection = z.infer<typeof userConnectionSchema>;

export const chatSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  title: z.string(),
  members: z.array(z.string()),
  unread: z.number().int().nonnegative(),
  lastMessage: z.string(),
  prompt: z.string(),
});
export type Chat = z.infer<typeof chatSchema>;

export const loginProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  city: z.string(),
  instagram: z.string(),
  linkedin: z.string(),
  intent: z.string(),
  initials: z.string(),
});
export type LoginProfile = z.infer<typeof loginProfileSchema>;

export const hostVisibilitySchema = z.enum(['public', 'curated', 'private']);
export type HostVisibility = z.infer<typeof hostVisibilitySchema>;

export const hostDraftSchema = z.object({
  template: z.string(),
  title: z.string(),
  capacity: z.string(),
  coverImageUrl: z.string().optional(),
  location: z.string().optional(),
  startsAt: z.string().optional(),
  vibe: z.string().optional(),
  about: z.string().optional(),
  visibility: hostVisibilitySchema,
});
export type HostDraft = z.infer<typeof hostDraftSchema>;

export const creatorSubmissionSchema = hostDraftSchema.extend({
  id: z.string(),
  creatorId: z.string(),
  location: z.string(),
  dateLabel: z.string(),
  trustNote: z.string(),
  status: eventStatusSchema,
});
export type CreatorSubmission = z.infer<typeof creatorSubmissionSchema>;

export const hostEventSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  status: eventStatusSchema,
  capacity: z.number().int().positive(),
  requestCount: z.number().int().nonnegative(),
  acceptedCount: z.number().int().nonnegative(),
  threadId: z.string().nullable(),
});
export type HostEventSummary = z.infer<typeof hostEventSummarySchema>;

export const hostGuestRequestSchema = rsvpRequestSchema.extend({
  eventTitle: z.string(),
});
export type HostGuestRequest = z.infer<typeof hostGuestRequestSchema>;

export const homeSummarySchema = z.object({
  upcomingRsvpCount: z.number().int().nonnegative(),
  savedCount: z.number().int().nonnegative(),
  inboxUnreadCount: z.number().int().nonnegative(),
  creatorSpotlight: creatorProfileSchema.nullable(),
});
export type HomeSummary = z.infer<typeof homeSummarySchema>;
