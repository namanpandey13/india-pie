import { z } from 'zod';

export const eventCategorySchema = z.enum(['coffee', 'culture', 'founders', 'sports', 'music']);
export type EventCategory = z.infer<typeof eventCategorySchema>;

export const attendeeSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  signal: z.string(),
  status: z.enum(['confirmed', 'maybe', 'host-approved']),
  initials: z.string(),
  color: z.string(),
});
export type Attendee = z.infer<typeof attendeeSchema>;

export const organizerSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  bio: z.string(),
  rating: z.string(),
  repeatRate: z.string(),
  links: z.array(z.string()),
  initials: z.string(),
  color: z.string(),
});
export type Organizer = z.infer<typeof organizerSchema>;

export const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  locality: z.string(),
  venue: z.string(),
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
  trustSignals: z.array(z.string()),
  prompts: z.array(z.string()),
  confidenceScore: z.number().min(0).max(100),
  friendContext: z.string(),
});
export type Event = z.infer<typeof eventSchema>;
