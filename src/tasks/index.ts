import { createSyncRecordUsageTitles } from '@/fields/DocumentConsumerTracking/tasks/createSyncRecordUsageTitles';
import type { TaskConfig } from 'payload';
import { nightly } from './schedules';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tasks: TaskConfig<any>[] = [
  createSyncRecordUsageTitles({
    taskSlug: 'sync-hero-image-usage',
    collectionSlug: 'hero-images',
    schedule: [nightly],
  }),
  createSyncRecordUsageTitles({
    taskSlug: 'sync-contact-portrait-usage',
    collectionSlug: 'contact-portraits',
    schedule: [nightly],
  }),
  createSyncRecordUsageTitles({
    taskSlug: 'sync-document-usage',
    collectionSlug: 'documents',
    schedule: [nightly],
  }),
  createSyncRecordUsageTitles({
    taskSlug: 'sync-media-usage',
    collectionSlug: 'media',
    schedule: [nightly],
  }),
];
