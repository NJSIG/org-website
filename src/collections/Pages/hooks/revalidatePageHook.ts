import { getPagePath } from '@/utilities/getPagePath';
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
      const path = getPagePath(doc);

      payload.logger.info(`Revalidating page at: ${path || '/'}`);

      revalidatePath(path || '/');
      revalidateTag('pages-sitemap', 'max');
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = getPagePath(previousDoc);

      payload.logger.info(`Revalidating old page at: ${oldPath || '/'}`);

      revalidatePath(oldPath || '/');
      revalidateTag('pages-sitemap', 'max');
    }
  }

  return doc;
};
