import { Subfund } from '@/payload-types';
import { revalidatePath, revalidateTag } from 'next/cache';
import { CollectionAfterDeleteHook } from 'payload';

export const revalidateSubfundDeleteHook: CollectionAfterDeleteHook<Subfund> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/subfunds/${doc?.slug}`;

    revalidatePath(path);
    revalidateTag('pages-sitemap', 'max');
  }
};
