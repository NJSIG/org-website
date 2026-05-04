import { getPagePath } from '@/utilities/getPagePath';
import { revalidatePath, revalidateTag } from 'next/cache';
import { CollectionAfterDeleteHook } from 'payload';
import type { Page } from '../../../payload-types';

export const revalidatePageDeleteHook: CollectionAfterDeleteHook<Page> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = getPagePath(doc);

    revalidatePath(path || '/');
    revalidateTag('pages-sitemap', 'max');
  }

  return doc;
};
