import { revalidatePath, revalidateTag } from 'next/cache';
import { CollectionAfterDeleteHook } from 'payload';
import type { Page } from '../../../payload-types';

export const revalidatePageDeleteHook: CollectionAfterDeleteHook<Page> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    // If the slug is 'home', revalidate the root path
    // Otherwise, revalidate the path of the slug
    const path = doc?.slug === 'home' ? '/' : `/${doc.slug}`;

    revalidatePath(path);
    revalidateTag('pages-sitemap');
  }

  return doc;
};
