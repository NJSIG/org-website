import { revalidatePath, revalidateTag } from 'next/cache';
import { CollectionAfterChangeHook } from 'payload';
import type { Page } from '../../../payload-types';

export const revalidatePageHook: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      // If the slug is 'home', revalidate the root path
      // Otherwise, revalidate the path of the slug
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`;

      payload.logger.info(`Revalidating page at: ${path}`);

      revalidatePath(path);
      revalidateTag('pages-sitemap');
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      // If the slug is 'home', revalidate the root path
      // Otherwise, revalidate the path of the slug
      const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`;

      payload.logger.info(`Revalidating old page at: ${oldPath}`);

      revalidatePath(oldPath);
      revalidateTag('pages-sitemap');
    }
  }

  return doc;
};
