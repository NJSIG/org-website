import { Subfund } from '@/payload-types';
import { revalidatePath, revalidateTag } from 'next/cache';
import { CollectionAfterChangeHook } from 'payload';

export const revalidateSubfundHook: CollectionAfterChangeHook<Subfund> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/subfunds/${doc.slug}`;

      payload.logger.info(`Revalidating subfund at: ${path}`);

      revalidatePath(path);
      revalidateTag('pages-sitemap');
    }
  }

  // If the page was previously published, we need to revalidate the old path
  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    const oldPath = `/subfunds/${previousDoc.slug}`;

    payload.logger.info(`Revalidating old subfund at: ${oldPath}`);

    revalidatePath(oldPath);
    revalidateTag('pages-sitemap');
  }

  return doc;
};
