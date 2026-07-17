import { APIError, BasePayload, CollectionSlug } from 'payload';
import { DocumentConsumer } from '../types';

/**
 * Add a tracking reference for a consumer to a document in a collection.
 *
 * @param payload The Payload CMS instance.
 * @param collectionSlug The slug of the collection.
 * @param consumerCollectionSlug The slug of the consumer collection.
 * @param consumerId The ID of the consumer document.
 * @param consumerTitleField The field name to use as the title for the consumer document.
 * @param consumerTitle The title of the consumer document.
 * @param recordId The ID of the document being consumed.
 * @param path The path to the field in the consumer document that is consuming the child document.
 * @returns A promise that resolves when the tracking reference has been added.
 */
export async function addTrackingReference(
  payload: BasePayload,
  collectionSlug: CollectionSlug,
  consumerCollectionSlug: CollectionSlug,
  consumerId: string,
  consumerTitleField: string,
  consumerTitle: string,
  documentId: string,
  path: string,
) {
  try {
    payload.logger.info(
      `Adding tracking reference for consumer ID ${consumerId} to document with ID ${documentId} in collection ${collectionSlug}.`,
    );

    const result = await payload.findByID({
      collection: collectionSlug,
      id: documentId,
      overrideAccess: true,
    });

    if (!result) {
      payload.logger.warn(
        `Document with ID ${documentId} not found in collection ${collectionSlug} while trying to add tracking reference for consumer ID ${consumerId}.`,
      );
      return;
    }

    const doc = result as { consumers?: DocumentConsumer[] };

    const existingConsumerIndex = doc.consumers?.findIndex(
      (consumer) => consumer.id === consumerId,
    );

    let updatedConsumers: DocumentConsumer[];

    if (existingConsumerIndex !== undefined && existingConsumerIndex >= 0) {
      // Consumer already exists, add new instance if it's not already there
      const existingConsumer = doc.consumers![existingConsumerIndex];

      if (!existingConsumer.instances.includes(path)) {
        const updatedConsumer = {
          ...existingConsumer,
          titleField: consumerTitleField, // Update titleField in case it has changed
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
      const newConsumer: DocumentConsumer = {
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
      id: documentId,
      data: { consumers: updatedConsumers },
      overrideAccess: true,
    });

    payload.logger.info(
      `Tracking reference added. Document with ID ${documentId} in collection ${collectionSlug} is now tracking consumer ID ${consumerId}.`,
    );
  } catch (error) {
    payload.logger.error(
      `Error adding tracking reference for consumer ID ${consumerId} to document with ID ${documentId} in collection ${collectionSlug}: ${(error as APIError).message}`,
    );
    throw error;
  }
}
