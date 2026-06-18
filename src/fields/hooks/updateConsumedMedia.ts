import {
  APIError,
  BasePayload,
  CollectionSlug,
  FieldHook,
  FieldHookArgs,
  UploadField,
} from 'payload';
import { MediaTrackingConsumer } from '../MediaTracking/types';

export const updateConsumedMedia: FieldHook = async ({
  req,
  operation,
  collection,
  originalDoc,
  field,
  schemaPath,
  value,
  previousValue,
}) => {
  if (operation === 'read') {
    return value;
  }

  const { payload } = req;
  const collectionSlug = collection?.slug;
  const docId = originalDoc.id;
  const relatedCollectionSlug = (field as UploadField).relationTo;
  const schemaPathString = schemaPath.join('.');

  try {
    if (!collectionSlug) {
      throw new APIError('Collection slug is missing in updateConsumedMedia hook.', 400);
    }

    if (!docId) {
      throw new APIError('Document ID is missing in updateConsumedMedia hook.', 400);
    }

    if (!relatedCollectionSlug) {
      throw new APIError('Related collection slug is missing in updateConsumedMedia hook.', 400);
    }

    await updateTrackedMedia(
      payload,
      operation,
      relatedCollectionSlug,
      collectionSlug,
      String(docId),
      value,
      previousValue,
      schemaPathString,
    );
  } catch (error) {
    payload.logger.error(
      `Error updating consumed media for document ID ${docId} in collection ${collectionSlug}: ${(error as APIError).message}`,
    );
    throw error;
  }

  return value;
};

async function updateTrackedMedia(
  payload: BasePayload,
  operation: FieldHookArgs['operation'],
  collectionSlug: CollectionSlug | CollectionSlug[],
  consumerCollectionSlug: CollectionSlug,
  consumerId: string,
  newMediaId: string | null | undefined,
  oldMediaId: string | null | undefined,
  schemaPath: string,
) {
  try {
    // If the collectionSlug is an array, we need to check each collection for the media to update
    if (Array.isArray(collectionSlug)) {
      await Promise.all(
        collectionSlug.map((slug) =>
          updateTrackedMedia(
            payload,
            operation,
            slug,
            consumerCollectionSlug,
            consumerId,
            newMediaId,
            oldMediaId,
            schemaPath,
          ),
        ),
      );

      return;
    }

    // Bundle the operations to perform in parallel
    const operations: Promise<void>[] = [];

    // Queue up the operation to remove old reference on delete
    if (operation === 'delete' && oldMediaId) {
      operations.push(
        removeTrackingReference(
          payload,
          collectionSlug,
          String(consumerId),
          String(oldMediaId),
          schemaPath,
        ),
      );
    }

    // Queue up the operation to remove old reference if the media ID has changed
    if (operation === 'update' && oldMediaId && oldMediaId !== newMediaId) {
      operations.push(
        removeTrackingReference(
          payload,
          collectionSlug,
          String(consumerId),
          String(oldMediaId),
          schemaPath,
        ),
      );
    }

    // Queue up the operation to add new reference if there is a new media ID
    if (
      (operation === 'create' || operation === 'update') &&
      newMediaId &&
      newMediaId !== oldMediaId
    ) {
      operations.push(
        addTrackingReference(
          payload,
          collectionSlug,
          consumerCollectionSlug,
          String(consumerId),
          String(newMediaId),
          schemaPath,
        ),
      );
    }

    // Execute all operations in parallel
    await Promise.all(operations);
  } catch (error) {
    throw error;
  }
}

async function removeTrackingReference(
  payload: BasePayload,
  collectionSlug: CollectionSlug,
  consumerId: string,
  mediaId: string,
  schemaPath: string,
) {
  try {
    const result = await payload.findByID({
      collection: collectionSlug,
      id: mediaId,
      overrideAccess: true,
    });

    if (!result) {
      payload.logger.warn(
        `Media with ID ${mediaId} not found in collection ${collectionSlug} while trying to remove tracking reference for consumer ID ${consumerId}.`,
      );
      return;
    }

    const doc = result as { consumers?: MediaTrackingConsumer[] };

    if (!doc.consumers) {
      payload.logger.warn(
        `No consumers found for media with ID ${mediaId} in collection ${collectionSlug} while trying to remove tracking reference for consumer ID ${consumerId}.`,
      );
      return;
    }

    // Filter out matching schemaPath on matching consumerId, if there are no more instances for the consumer, remove the consumer entry entirely
    const updatedConsumers = doc.consumers
      .map((consumer) => {
        if (consumer.id === consumerId && consumer.instances.includes(schemaPath)) {
          const remainingInstances = consumer.instances.filter(
            (instance) => instance !== schemaPath,
          );

          if (remainingInstances.length > 0) {
            return { ...consumer, instances: remainingInstances };
          }

          return null; // Mark for removal if no more instances
        }

        return consumer; // No change for other consumers
      })
      .filter((consumer): consumer is MediaTrackingConsumer => consumer !== null); // Remove marked consumers

    await payload.update({
      collection: collectionSlug,
      id: mediaId,
      data: { consumers: updatedConsumers },
      overrideAccess: true,
    });

    payload.logger.info(
      `Removed tracking reference for consumer ID ${consumerId} from media with ID ${mediaId} in collection ${collectionSlug}.`,
    );
  } catch (error) {
    throw error;
  }
}

async function addTrackingReference(
  payload: BasePayload,
  collectionSlug: CollectionSlug,
  consumerCollectionSlug: CollectionSlug,
  consumerId: string,
  mediaId: string,
  schemaPath: string,
) {
  console.log(
    'Adding tracking reference for consumer ID',
    consumerId,
    'to media ID',
    mediaId,
    'in collection',
    collectionSlug,
  );
  try {
    const result = await payload.findByID({
      collection: collectionSlug,
      id: mediaId,
      overrideAccess: true,
    });

    if (!result) {
      payload.logger.warn(
        `Media with ID ${mediaId} not found in collection ${collectionSlug} while trying to add tracking reference for consumer ID ${consumerId}.`,
      );
      return;
    }

    const doc = result as { consumers?: MediaTrackingConsumer[] };

    const existingConsumerIndex = doc.consumers?.findIndex(
      (consumer) => consumer.id === consumerId,
    );

    let updatedConsumers: MediaTrackingConsumer[];

    if (existingConsumerIndex !== undefined && existingConsumerIndex >= 0) {
      // Consumer already exists, add new instance if it's not already there
      const existingConsumer = doc.consumers![existingConsumerIndex];

      if (!existingConsumer.instances.includes(schemaPath)) {
        const updatedConsumer = {
          ...existingConsumer,
          instances: [...existingConsumer.instances, schemaPath],
        };

        updatedConsumers = [...doc.consumers!.splice(existingConsumerIndex, 1), updatedConsumer];
      } else {
        // Instance already tracked, no update needed
        return;
      }
    } else {
      // Consumer does not exist, add new consumer entry
      const newConsumer: MediaTrackingConsumer = {
        id: consumerId,
        collectionSlug: consumerCollectionSlug,
        instances: [schemaPath],
      };

      updatedConsumers = doc.consumers ? [...doc.consumers, newConsumer] : [newConsumer];
    }

    console.log('Updated consumers for media ID', mediaId, ':', JSON.stringify(updatedConsumers));

    await payload.update({
      collection: collectionSlug,
      id: mediaId,
      data: { consumers: updatedConsumers },
      overrideAccess: true,
    });

    payload.logger.info(
      `Added tracking reference for consumer ID ${consumerId} to media with ID ${mediaId} in collection ${collectionSlug}.`,
    );
  } catch (error) {
    payload.logger.error(
      `Error adding tracking reference for consumer ID ${consumerId} to media with ID ${mediaId} in collection ${collectionSlug}: ${(error as APIError).message}`,
    );
    throw error;
  }
}
