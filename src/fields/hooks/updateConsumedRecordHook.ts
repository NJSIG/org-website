import {
  APIError,
  BasePayload,
  CollectionSlug,
  FieldHook,
  FieldHookArgs,
  UploadField,
} from 'payload';
import { RecordTrackingConsumer } from '../RecordUsageTracking/types';

/**
 * Factory function to create a field hook for updating consumed records in a Payload CMS collection.
 * This hook will update the tracking information for records that are consumed by other documents.
 * It handles create, update, and delete operations, ensuring that the tracking information is kept up to date.
 *
 * @param useAsTitle The field name to use as the title for the consumer document. Defaults to 'title' if not provided.
 * @returns A field hook function to be used in a Payload CMS collection.
 */
export const createUpdateConsumedRecordHook = (useAsTitle: string): FieldHook => {
  const titleField = useAsTitle || 'title';

  return async ({ req, operation, collection, originalDoc, field, path, value, previousValue }) => {
    if (operation === 'read') {
      return value;
    }

    const { payload } = req;
    const collectionSlug = collection?.slug;
    const docId = originalDoc.id;
    const docTitle = originalDoc[titleField] || `Document ${docId}`;
    const relatedCollectionSlug = (field as UploadField).relationTo;
    const pathString = path.join('.');

    try {
      if (!collectionSlug) {
        throw new APIError('Collection slug is missing in updateConsumedRecord hook.', 400);
      }

      if (!docId) {
        throw new APIError('Document ID is missing in updateConsumedRecord hook.', 400);
      }

      if (!relatedCollectionSlug) {
        throw new APIError('Related collection slug is missing in updateConsumedRecord hook.', 400);
      }

      await updateTrackedRecord(
        payload,
        operation,
        relatedCollectionSlug,
        collectionSlug,
        String(docId),
        titleField,
        docTitle,
        value,
        previousValue,
        pathString,
      );
    } catch (error) {
      payload.logger.error(
        `Error updating consumed record for document ID ${docId} in collection ${collectionSlug}: ${(error as APIError).message}`,
      );

      throw error;
    }

    return value;
  };
};

/**
 * Handle nested collection slugs and perform the appropriate operations to update the tracking information for consumed records.
 *
 * @param payload The Payload CMS instance.
 * @param operation The operation being performed ('create', 'update', 'delete').
 * @param collectionSlug The slug of the collection or an array of collection slugs.
 * @param consumerCollectionSlug The slug of the consumer collection.
 * @param consumerId The ID of the consumer document.
 * @param consumerTitleField The field name to use as the title for the consumer document.
 * @param consumerTitle The title of the consumer document.
 * @param newRecordId The ID of the new record being consumed.
 * @param oldRecordId The ID of the old record being replaced or removed.
 * @param path The path to the field in the consumer document that is consuming the record.
 * @returns A promise that resolves when the tracking information has been updated.
 */
async function updateTrackedRecord(
  payload: BasePayload,
  operation: FieldHookArgs['operation'],
  collectionSlug: CollectionSlug | CollectionSlug[],
  consumerCollectionSlug: CollectionSlug,
  consumerId: string,
  consumerTitleField: string,
  consumerTitle: string,
  newRecordId: string | null | undefined,
  oldRecordId: string | null | undefined,
  path: string,
) {
  try {
    // If the collectionSlug is an array, we need to check each collection for the media to update
    if (Array.isArray(collectionSlug)) {
      await Promise.all(
        collectionSlug.map((slug) =>
          updateTrackedRecord(
            payload,
            operation,
            slug,
            consumerCollectionSlug,
            consumerId,
            consumerTitleField,
            consumerTitle,
            newRecordId,
            oldRecordId,
            path,
          ),
        ),
      );

      return;
    }

    // Bundle the operations to perform in parallel
    const operations: Promise<void>[] = [];

    // Queue up the operation to remove old reference on delete
    if (operation === 'delete' && oldRecordId) {
      operations.push(
        removeTrackingReference(
          payload,
          collectionSlug,
          String(consumerId),
          String(oldRecordId),
          path,
        ),
      );
    }

    // Queue up the operation to remove old reference if the record ID has changed
    if (operation === 'update' && oldRecordId && oldRecordId !== newRecordId) {
      operations.push(
        removeTrackingReference(
          payload,
          collectionSlug,
          String(consumerId),
          String(oldRecordId),
          path,
        ),
      );
    }

    // Queue up the operation to add new reference if there is a new record ID
    if (
      (operation === 'create' || operation === 'update') &&
      newRecordId &&
      newRecordId !== oldRecordId
    ) {
      operations.push(
        addTrackingReference(
          payload,
          collectionSlug,
          consumerCollectionSlug,
          String(consumerId),
          consumerTitleField,
          consumerTitle,
          String(newRecordId),
          path,
        ),
      );
    }

    // Execute all operations in parallel
    await Promise.all(operations);
  } catch (error) {
    throw error;
  }
}

/**
 * Remove a tracking reference for a consumer from a record in a collection.
 *
 * @param payload The Payload CMS instance.
 * @param collectionSlug The slug of the collection.
 * @param consumerId The ID of the consumer document.
 * @param recordId The ID of the record being consumed.
 * @param path The path to the field in the consumer document that is consuming the record.
 * @returns A promise that resolves when the tracking reference has been removed.
 */
async function removeTrackingReference(
  payload: BasePayload,
  collectionSlug: CollectionSlug,
  consumerId: string,
  recordId: string,
  path: string,
) {
  try {
    payload.logger.info(
      `Removing tracking reference for consumer ID ${consumerId} from record with ID ${recordId} in collection ${collectionSlug}.`,
    );

    let result;
    try {
      result = await payload.findByID({
        collection: collectionSlug,
        id: recordId,
        overrideAccess: true,
      });
    } catch (error) {
      if (isNotFoundError(error)) {
        payload.logger.warn(
          `Record with ID ${recordId} not found in collection ${collectionSlug} while trying to remove tracking reference for consumer ID ${consumerId}.`,
        );
        return;
      }

      throw error;
    }

    if (!result) {
      payload.logger.warn(
        `Record with ID ${recordId} not found in collection ${collectionSlug} while trying to remove tracking reference for consumer ID ${consumerId}.`,
      );
      return;
    }

    const doc = result as { consumers?: RecordTrackingConsumer[] };

    if (!doc.consumers) {
      payload.logger.warn(
        `No consumers found for record with ID ${recordId} in collection ${collectionSlug} while trying to remove tracking reference for consumer ID ${consumerId}.`,
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
      .filter((consumer): consumer is RecordTrackingConsumer => consumer !== null); // Remove marked consumers

    await payload.update({
      collection: collectionSlug,
      id: recordId,
      data: { consumers: updatedConsumers },
      overrideAccess: true,
    });

    payload.logger.info(
      `Tracking reference removed. Record with ID ${recordId} in collection ${collectionSlug} is no longer tracking consumer ID ${consumerId}.`,
    );
  } catch (error) {
    throw error;
  }
}

/**
 * Add a tracking reference for a consumer to a record in a collection.
 *
 * @param payload The Payload CMS instance.
 * @param collectionSlug The slug of the collection.
 * @param consumerCollectionSlug The slug of the consumer collection.
 * @param consumerId The ID of the consumer document.
 * @param consumerTitleField The field name to use as the title for the consumer document.
 * @param consumerTitle The title of the consumer document.
 * @param recordId The ID of the record being consumed.
 * @param path The path to the field in the consumer document that is consuming the record.
 * @returns A promise that resolves when the tracking reference has been added.
 */
async function addTrackingReference(
  payload: BasePayload,
  collectionSlug: CollectionSlug,
  consumerCollectionSlug: CollectionSlug,
  consumerId: string,
  consumerTitleField: string,
  consumerTitle: string,
  recordId: string,
  path: string,
) {
  try {
    payload.logger.info(
      `Adding tracking reference for consumer ID ${consumerId} to record with ID ${recordId} in collection ${collectionSlug}.`,
    );

    const result = await payload.findByID({
      collection: collectionSlug,
      id: recordId,
      overrideAccess: true,
    });

    if (!result) {
      payload.logger.warn(
        `Record with ID ${recordId} not found in collection ${collectionSlug} while trying to add tracking reference for consumer ID ${consumerId}.`,
      );
      return;
    }

    const doc = result as { consumers?: RecordTrackingConsumer[] };

    const existingConsumerIndex = doc.consumers?.findIndex(
      (consumer) => consumer.id === consumerId,
    );

    let updatedConsumers: RecordTrackingConsumer[];

    if (existingConsumerIndex !== undefined && existingConsumerIndex >= 0) {
      // Consumer already exists, add new instance if it's not already there
      const existingConsumer = doc.consumers![existingConsumerIndex];

      if (!existingConsumer.instances.includes(path)) {
        const updatedConsumer = {
          ...existingConsumer,
          title: consumerTitle, // Update title in case it has changed
          instances: [...existingConsumer.instances, path],
        };

        updatedConsumers = doc.consumers!.map((consumer, idx) =>
          idx === existingConsumerIndex ? updatedConsumer : consumer,
        );
      } else {
        // Instance already tracked, no update needed
        return;
      }
    } else {
      // Consumer does not exist, add new consumer entry
      const newConsumer: RecordTrackingConsumer = {
        id: consumerId,
        titleField: consumerTitleField,
        title: consumerTitle,
        collectionSlug: consumerCollectionSlug,
        instances: [path],
      };

      updatedConsumers = doc.consumers ? [...doc.consumers, newConsumer] : [newConsumer];
    }

    await payload.update({
      collection: collectionSlug,
      id: recordId,
      data: { consumers: updatedConsumers },
      overrideAccess: true,
    });

    payload.logger.info(
      `Tracking reference added. Record with ID ${recordId} in collection ${collectionSlug} is now tracking consumer ID ${consumerId}.`,
    );
  } catch (error) {
    payload.logger.error(
      `Error adding tracking reference for consumer ID ${consumerId} to record with ID ${recordId} in collection ${collectionSlug}: ${(error as APIError).message}`,
    );
    throw error;
  }
}

/**
 * A utility function to determine if an error is a "not found" error based on its properties.
 * This function checks for common patterns in error objects that indicate a resource was not found.
 * It looks for status codes, status properties, and specific message content to make this determination.
 *
 * @param error The error object to check.
 * @returns True if the error indicates a "not found" condition, false otherwise.
 */
function isNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const typedError = error as {
    status?: number;
    statusCode?: number;
    data?: { status?: number };
    message?: string;
  };

  const status = typedError.status ?? typedError.statusCode ?? typedError.data?.status;
  if (status === 404) {
    return true;
  }

  const message = typedError.message?.toLowerCase() ?? '';

  return message.includes('not found') || message.includes('no document');
}
