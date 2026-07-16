import { APIError, FieldHook, UploadField } from 'payload';
import { updateTrackedRecord } from '../DocumentConsumerTracking/utils/updateTrackingReference';

/**
 * Factory function to create a field hook for updating consumed records in a Payload CMS collection.
 * This hook will update the tracking information for records that are consumed by other documents.
 * It handles create, update, and delete operations, ensuring that the tracking information is kept up to date.
 *
 * @param useAsTitle The field name to use as the title for the consumer document. Defaults to 'title' if not provided.
 * @returns A field hook function to be used in a Payload CMS collection.
 */
export const createUpdateConsumedDocumentHook = (useAsTitle: string): FieldHook => {
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
        throw new APIError('Collection slug is missing in updateConsumedDocument hook.', 400);
      }

      if (!docId) {
        throw new APIError('Document ID is missing in updateConsumedDocument hook.', 400);
      }

      if (!relatedCollectionSlug) {
        throw new APIError(
          'Related collection slug is missing in updateConsumedDocument hook.',
          400,
        );
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
        `Error updating consumer data for document ID ${docId} in collection ${collectionSlug}: ${(error as APIError).message}`,
      );

      throw error;
    }

    return value;
  };
};
