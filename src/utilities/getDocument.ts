import { Config } from '@/payload-types';
import configPromise from '@payload-config';
import { getPayload } from 'payload';

type Collection = keyof Config['collections'];

export async function getDocument(collection: Collection, slug: string, depth = 0) {
  const payload = await getPayload({ config: configPromise });

  const page = await payload.find({
    collection,
    depth,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return page.docs[0];
}
