import { Event } from '@/payload-types';
import { Temporal } from '@js-temporal/polyfill';

export const generateEventLink = (event: Pick<Event, 'slug' | 'startDate'>): string => {
  const { slug, startDate } = event;
  const date = Temporal.PlainDate.from(startDate.slice(0, 10)); // Extract date portion and convert to Temporal.PlainDate

  if (!slug) {
    return '/404'; // Fallback URL if slug is missing
  }

  return `/events/${date.year}/${date.month.toString().padStart(2, '0')}/${date.day.toString().padStart(2, '0')}/${slug}`;
};
