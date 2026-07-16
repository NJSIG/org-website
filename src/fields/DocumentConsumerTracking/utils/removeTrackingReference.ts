import type { BasePayload, CollectionSlug } from 'payload';
import type { DocumentConsumer } from '../types';
import { isNotFoundError } from './isNotFoundError';

/**
 * Remove a tracking reference for a consumer from a document in a collection.
 *
 * @param payload The Payload CMS instance.
 * @param collectionSlug The slug of the collection.
 * @param consumerId The ID of the consumer document.
 * @param documentId The ID of the document being consumed.
 * @param path The path to the field in the consumer document that is consuming the child document.
 * @returns A promise that resolves when the tracking reference has been removed.
 */
export async function removeTrackingReference(
  payload: BasePayload,
  collectionSlug: CollectionSlug,
  consumerId: string,
  documentId: string,
  path: string,
) {
  try {
    payload.logger.info(
      `Removing tracking reference for consumer ID ${consumerId} from document with ID ${documentId} in collection ${collectionSlug}.`,
    );

    let result;
    try {
      result = await payload.findByID({
        collection: collectionSlug,
        id: documentId,
        overrideAccess: true,
      });
    } catch (error) {
      if (isNotFoundError(error)) {
        payload.logger.warn(
          `Document with ID ${documentId} not found in collection ${collectionSlug} while trying to remove tracking reference for consumer ID ${consumerId}.`,
        );
        return;
      }

      throw error;
    }

    if (!result) {
      payload.logger.warn(
        `Document with ID ${documentId} not found in collection ${collectionSlug} while trying to remove tracking reference for consumer ID ${consumerId}.`,
      );
      return;
    }

    const doc = result as { consumers?: DocumentConsumer[] };

    if (!doc.consumers) {
      payload.logger.warn(
        `No consumers found for document with ID ${documentId} in collection ${collectionSlug} while trying to remove tracking reference for consumer ID ${consumerId}.`,
      );
      return;
    }

    // Filter out matching path on matching consumerId, if there are no more instances for the consumer, remove the consumer entry entirely
    const updatedConsumers = doc.consumers
      .map((consumer) => {
        if (consumer.id === consumerId && consumer.instances.includes(path)) {
          const remainingInstances = consumer.instances.filter((instance) => instance !== path);

          if (remainingInstances.length > 0) {
            return { ...consumer, instances: remainingInstances };
          }

          return null; // Mark for removal if no more instances
        }

        return consumer; // No change for other consumers
      })
      .filter((consumer): consumer is DocumentConsumer => consumer !== null); // Remove marked consumers

    await payload.update({
      collection: collectionSlug,
      id: documentId,
      data: { consumers: updatedConsumers },
      overrideAccess: true,
    });

    payload.logger.info(
      `Tracking reference removed. Document with ID ${documentId} in collection ${collectionSlug} is no longer tracking consumer ID ${consumerId}.`,
    );
  } catch (error) {
    throw error;
  }
}
