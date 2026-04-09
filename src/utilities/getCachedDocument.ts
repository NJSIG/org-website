import { Config } from '@/payload-types';
import { unstable_cache } from 'next/cache';
import { getDocument } from './getDocument';

type Collection = keyof Config['collections'];

/**
 * Returns an unstable_cache function mapped with the cache tag for a document id.
 */
export const getCachedDocument = (collection: Collection, id: string) =>
  unstable_cache(async () => getDocument(collection, id), [collection, id], {
    tags: [`${collection}_${id}`],
  });
