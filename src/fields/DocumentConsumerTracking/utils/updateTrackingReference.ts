import { BasePayload, CollectionSlug, FieldHookArgs } from 'payload';
import { addTrackingReference } from './addTrackingReference';
import { removeTrackingReference } from './removeTrackingReference';

/**
 * Handle nested collection slugs and perform the appropriate operations to update the tracking information for consumed documents.
 *
 * @param payload The Payload CMS instance.
 * @param operation The operation being performed ('create', 'update', 'delete').
 * @param collectionSlug The slug of the collection or an array of collection slugs.
 * @param consumerCollectionSlug The slug of the consumer collection.
 * @param consumerId The ID of the consumer document.
 * @param consumerTitleField The field name to use as the title for the consumer document.
 * @param consumerTitle The title of the consumer document.
 * @param newDocumentId The ID of the new document being consumed.
 * @param oldDocumentId The ID of the old document being replaced or removed.
 * @param path The path to the field in the consumer document that is consuming the child document.
 * @returns A promise that resolves when the tracking information has been updated.
 */
export async function updateTrackedRecord(
  payload: BasePayload,
  operation: FieldHookArgs['operation'],
  collectionSlug: CollectionSlug | CollectionSlug[],
  consumerCollectionSlug: CollectionSlug,
  consumerId: string,
  consumerTitleField: string,
  consumerTitle: string,
  newDocumentId: string | null | undefined,
  oldDocumentId: string | null | undefined,
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
            newDocumentId,
            oldDocumentId,
            path,
          ),
        ),
      );

      return;
    }

    // Bundle the operations to perform in parallel
    const operations: Promise<void>[] = [];

    // Queue up the operation to remove old reference on delete
    if (operation === 'delete' && oldDocumentId) {
      operations.push(
        removeTrackingReference(
          payload,
          collectionSlug,
          String(consumerId),
          String(oldDocumentId),
          path,
        ),
      );
    }

    // Queue up the operation to remove old reference if the document ID has changed
    if (operation === 'update' && oldDocumentId && oldDocumentId !== newDocumentId) {
      operations.push(
        removeTrackingReference(
          payload,
          collectionSlug,
          String(consumerId),
          String(oldDocumentId),
          path,
        ),
      );
    }

    // Queue up the operation to add new reference if there is a new record ID
    if (
      (operation === 'create' || operation === 'update') &&
      newDocumentId &&
      newDocumentId !== oldDocumentId
    ) {
      operations.push(
        addTrackingReference(
          payload,
          collectionSlug,
          consumerCollectionSlug,
          String(consumerId),
          consumerTitleField,
          consumerTitle,
          String(newDocumentId),
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
