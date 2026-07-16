import type { Config } from '@/payload-types';
import type { TaskConfig } from 'payload';
import { Merge } from 'ts-essentials';
import { ConsumerDocument, TrackedDocument } from '../types';

type TaskSettings<TSlug extends string> = {
  taskSlug: TSlug;
  collectionSlug: keyof Config['collections'];
  schedule?: TaskConfig['schedule'];
};

type TaskOutput = {
  checkedRecords: number;
  removedConsumers: number;
  updatedConsumers: number;
  errors: Array<{ recordId: string; consumerId: string; error: string }>;
};

type SyncRecordUsageTask<TSlug extends string> = Merge<
  TaskConfig,
  {
    slug: TSlug;
  }
>;

export const createSyncRecordUsageTitles = <TSlug extends string>(
  settings: TaskSettings<TSlug>,
): SyncRecordUsageTask<TSlug> => {
  return {
    slug: settings.taskSlug,
    schedule: settings.schedule || [
      {
        cron: '0 0 * * *', // 12:00 AM every day
        queue: 'sync-record-usage', // Use the "sync-record-usage" queue for this task
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
      const output: TaskOutput = {
        checkedRecords: 0,
        removedConsumers: 0,
        updatedConsumers: 0,
        errors: [],
      };

      try {
        const tracked = (await payload.find({
          collection: settings.collectionSlug,
          limit: 0, // Fetch all records
          select: {
            consumers: true,
          },
        })) || { docs: [] };

        for (const doc of tracked.docs as TrackedDocument[]) {
          const consumers = doc.consumers || [];

          for (const consumer of consumers) {
            output.checkedRecords += 1;

            try {
              const consumerDoc =
                (await payload.findByID({
                  collection: consumer.collectionSlug as keyof Config['collections'],
                  id: consumer.id,
                })) || null;

              if (!consumerDoc) {
                // Consumer document not found, remove the consumer from the tracked document
                await payload.update({
                  collection: settings.collectionSlug,
                  id: doc.id,
                  data: {
                    consumers: consumers.filter((c) => c.id !== consumer.id),
                  },
                });

                output.removedConsumers += 1;
                continue;
              }

              const consumerDocument = consumerDoc as unknown as ConsumerDocument;
              const consumerTitle = String(consumerDocument[consumer.titleField] ?? '');

              if (consumerTitle !== consumer.title) {
                // Update the consumer title in the tracked document
                await payload.update({
                  collection: settings.collectionSlug,
                  id: doc.id,
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
                recordId: doc.id,
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
