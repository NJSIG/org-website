import { DocumentConsumer } from '@/fields/DocumentConsumerTracking/types';
import { APIError, BasePayload, CollectionBeforeDeleteHook, CollectionSlug } from 'payload';

export const preventDeleteWhenConsumedHook: CollectionBeforeDeleteHook = async ({
  id,
  collection,
  req,
}) => {
  const { payload } = req;
  const collectionSlug = collection.slug;

  try {
    const [usage] = await Promise.all([getUsageData(payload, collectionSlug, id)]);

    if (usage && usage.length > 0) {
      throw new APIError(`Cannot delete an item currently in use.`, 409);
    }
  } catch (error) {
    req.payload.logger.error(
      `Prevented deletion of ${collectionSlug} with ID ${id}: ${(error as APIError).message}`,
    );
    throw error;
  }
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
