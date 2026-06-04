export function countConfirmed(attendees: { status: string }[]) {
  return attendees.filter((attendee) => attendee.status === 'confirmed').length;
}

export function formatEventMeta(event: {
  locality?: string;
  venue?: { name: string; locality: string };
  dateLabel: string;
  timeLabel: string;
}) {
  const place = event.venue?.locality ?? event.locality ?? event.venue?.name;
  return `${place} - ${event.dateLabel}, ${event.timeLabel}`;
}

export function toggleInList(items: string[], id: string) {
  return items.includes(id) ? items.filter((item) => item !== id) : [...items, id];
}

export type LogLevel = 'info' | 'warn' | 'error';

export function logAppEvent(level: LogLevel, context: string, details?: unknown) {
  const payload = {
    context,
    details: sanitizeLogDetails(details),
  };

  if (level === 'error') {
    console.error('[Hausy]', payload);
    return;
  }

  if (level === 'warn') {
    console.warn('[Hausy]', payload);
    return;
  }

  console.info('[Hausy]', payload);
}

function sanitizeLogDetails(details: unknown) {
  if (!details || typeof details !== 'object') {
    return details;
  }

  return Object.fromEntries(
    Object.entries(details as Record<string, unknown>).filter(([key]) => {
      const normalized = key.toLowerCase();
      return !normalized.includes('token') && !normalized.includes('secret') && !normalized.includes('password');
    }),
  );
}
