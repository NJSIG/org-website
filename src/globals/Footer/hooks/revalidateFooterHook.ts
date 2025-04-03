import { revalidateTag } from 'next/cache';
import { GlobalAfterChangeHook } from 'payload';

export const revalidateFooterHook: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating footer...`);

    revalidateTag('global_footer');
  }

  return doc;
};
