import { MediaTrackingConsumer } from '@/fields/MediaTracking/types';
import { APIError, BasePayload, CollectionBeforeDeleteHook, CollectionSlug } from 'payload';

export const checkUsageHook: CollectionBeforeDeleteHook = async ({ id, collection, req }) => {
  const { payload } = req;
  const collectionSlug = collection.slug;

  try {
    const [usage] = await Promise.all([getUsageData(payload, collectionSlug, id)]);

    if (usage && usage.length > 0) {
      throw new APIError(
        `Cannot delete ${collectionSlug} with ID ${id} because it is currently in use.`,
        409,
      );
    }
  } catch (error) {
    req.payload.logger.error(`Prevented deletion of ${collectionSlug} with ID ${id}.`);
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
    });

    if (!result) {
      throw new APIError(`No ${collectionSlug} found with ID ${id}.`, 404);
    }

    const doc = result as { consumers?: MediaTrackingConsumer[] };

    return doc.consumers ?? [];
  } catch (error) {
    payload.logger.error(`Error getting usage data for ${collectionSlug} with ID ${id}.`);
    throw error;
  }
}
