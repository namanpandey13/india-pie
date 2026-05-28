export function countConfirmed(attendees: { status: string }[]) {
  return attendees.filter((attendee) => attendee.status !== 'maybe').length;
}

export function formatEventMeta(event: { locality?: string; venue?: string; dateLabel: string; timeLabel: string }) {
  const place = event.locality ?? event.venue;
  return `${place} - ${event.dateLabel}, ${event.timeLabel}`;
}

export function toggleInList(items: string[], id: string) {
  return items.includes(id) ? items.filter((item) => item !== id) : [...items, id];
}
