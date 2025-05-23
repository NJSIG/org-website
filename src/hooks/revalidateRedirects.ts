import { revalidateTag } from 'next/cache';
import { CollectionAfterChangeHook } from 'payload';

export const revalidateRedirects: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info('Revalidating redirects.');

  revalidateTag('redirects');

  return doc;
};
