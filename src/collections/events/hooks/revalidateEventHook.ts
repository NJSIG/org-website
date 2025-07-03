import { Event } from '@/payload-types';
import { revalidatePath, revalidateTag } from 'next/cache';
import { CollectionAfterChangeHook } from 'payload';

export const revalidateEventHook: CollectionAfterChangeHook<Event> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/events/${doc.slug}`;

      payload.logger.info(`Revalidating event at path: ${path}`);

      revalidatePath(path);
      revalidateTag('events-sitemap');
    }

    // If the event was previously published, we need to revalidate the previous path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/events/${previousDoc.slug}`;

      payload.logger.info(`Revalidating old event path: ${oldPath}`);

      revalidatePath(oldPath);
      revalidateTag('events-sitemap');
    }
  }

  return doc;
};
