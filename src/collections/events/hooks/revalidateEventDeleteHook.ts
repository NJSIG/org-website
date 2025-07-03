import { Event } from '@/payload-types';
import { revalidatePath, revalidateTag } from 'next/cache';
import { CollectionAfterDeleteHook } from 'payload';

export const revalidateEventDeleteHook: CollectionAfterDeleteHook<Event> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/events/${doc?.slug}`;

    revalidatePath(path);
    revalidateTag('events-sitemap');
  }

  return doc;
};
