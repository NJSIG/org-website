import { DocumentConsumer } from '@/fields/DocumentConsumerTracking/types';
import { APIError, BasePayload, CollectionBeforeChangeHook, CollectionSlug } from 'payload';

export const preventSoftDeleteWhenConsumedHook: CollectionBeforeChangeHook = async ({
  originalDoc,
  collection,
  req,
  operation,
  data,
}) => {
  if (
    operation === 'update' &&
    originalDoc &&
    data.deletedAt !== undefined &&
    data.deletedAt !== null
  ) {
    const { payload } = req;
    const collectionSlug = collection.slug;

    try {
      const [usage] = await Promise.all([getUsageData(payload, collectionSlug, originalDoc.id)]);

      if (usage && usage.length > 0) {
        throw new APIError(`Cannot delete an item currently in use.`, 409);
      }
    } catch (error) {
      req.payload.logger.error(
        `Prevented soft-delete of ${collectionSlug} with ID ${originalDoc.id}: ${(error as APIError).message}`,
      );
      throw error;
    }
  }

  return data;
};

async function getUsageData(
  payload: BasePayload,
  collectionSlug: CollectionSlug,
  id: string | number,
) {
  try {
    const result = await payload.findByID({
      collection: collectionSlug,
      id,
      overrideAccess: true,
      trash: true,
    });

    if (!result) {
      throw new APIError(`No ${collectionSlug} found with ID ${id}.`, 404);
    }

    const doc = result as { consumers?: DocumentConsumer[] };

    return doc.consumers ?? [];
  } catch (error) {
    throw error;
  }
}
