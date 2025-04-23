import { revalidateTag } from 'next/cache';
import { GlobalAfterChangeHook } from 'payload';

export const revalidateHeaderHook: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating header...`);

    revalidateTag('global_header');
  }

  return doc;
};
