import { removeTrackingReference } from '@/fields/RecordUsageTracking/utils/removeTrackingReference';
import type { Config } from '@/payload-types';
import type { TaskConfig } from 'payload';
import { RecordTrackingConsumer } from '../types';

type TaskSettings<TSlug extends string> = {
  taskSlug: TSlug;
  collectionSlug: keyof Config['collections'];
  schedule?: TaskConfig['schedule'];
};

type SyncRecordUsageTask<TSlug extends string> = Omit<TaskConfig, 'slug'> & {
  slug: TSlug;
  schedule?: TaskConfig['schedule'];
};

type MediaRecord = {
  id: string;
  consumers?: RecordTrackingConsumer[];
};

type ConsumerDocument = Record<string, unknown>;

type Output = {
  checkedRecords: number;
  removedConsumers: number;
  updatedConsumers: number;
  errors: Array<{ recordId: string; consumerId: string; error: string }>;
};

export const createSyncRecordUsageTitles = <TSlug extends string>(
  settings: TaskSettings<TSlug>,
): SyncRecordUsageTask<TSlug> => {
  return {
    slug: settings.taskSlug,
    schedule: settings.schedule || [
      {
        cron: '0 1 * * *', // 1:00 AM every day
        queue: 'maintenance', // Use the "maintenance" queue for this task
      },
    ],
    outputSchema: [
      {
        name: 'checkedRecords',
        type: 'number',
      },
      {
        name: 'removedConsumers',
        type: 'number',
      },
      {
        name: 'updatedConsumers',
        type: 'number',
      },
      {
        name: 'errors',
        type: 'array',
        fields: [
          {
            name: 'recordId',
            type: 'text',
          },
          {
            name: 'consumerId',
            type: 'text',
          },
          {
            name: 'error',
            type: 'text',
          },
        ],
      },
    ],
    handler: async ({ req }) => {
      const { payload } = req;
      const output: Output = {
        checkedRecords: 0,
        removedConsumers: 0,
        updatedConsumers: 0,
        errors: [],
      };

      try {
        const media = (await payload.find({
          collection: settings.collectionSlug,
          limit: 0, // Fetch all records
          select: {
            consumers: true,
          },
        })) || { docs: [] };

        for (const mediaItem of media.docs as MediaRecord[]) {
          const consumers = mediaItem.consumers || [];

          for (const consumer of consumers) {
            output.checkedRecords += 1;

            try {
              const consumerDoc =
                (await payload.findByID({
                  collection: consumer.collectionSlug as keyof Config['collections'],
                  id: consumer.id,
                })) || null;

              if (!consumerDoc) {
                // Consumer document not found, remove the consumer from the media item
                await removeTrackingReference(
                  payload,
                  settings.collectionSlug,
                  consumer.id,
                  mediaItem.id,
                  consumer.titleField || 'title',
                );

                output.removedConsumers += 1;
                continue;
              }

              const consumerDocument = consumerDoc as unknown as ConsumerDocument;
              const consumerTitle = String(consumerDocument[consumer.titleField] ?? '');

              if (consumerTitle !== consumer.title) {
                // Update the consumer title in the media item
                await payload.update({
                  collection: settings.collectionSlug,
                  id: mediaItem.id,
                  data: {
                    consumers: consumers.map((c) =>
                      c.id === consumer.id ? { ...c, title: consumerTitle } : c,
                    ),
                  },
                });

                output.updatedConsumers += 1;
              }
            } catch (error) {
              output.errors.push({
                recordId: mediaItem.id,
                consumerId: consumer.id,
                error: (error as Error).message,
              });
            }
          }
        }
      } catch (error) {
        output.errors.push({
          recordId: 'N/A',
          consumerId: 'N/A',
          error: (error as Error).message,
        });
      }

      return { state: 'succeeded', output };
    },
  };
};
