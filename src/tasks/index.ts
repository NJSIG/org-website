import { createSyncDocumentConsumerTitles } from '@/fields/DocumentConsumerTracking/tasks/createSyncDocumentConsumerTitles';
import type { TaskConfig } from 'payload';
import { nightly } from './schedules';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tasks: TaskConfig<any>[] = [
  createSyncDocumentConsumerTitles({
    taskSlug: 'sync-hero-image-consumers',
    collectionSlug: 'hero-images',
    schedule: [nightly],
  }),
  createSyncDocumentConsumerTitles({
    taskSlug: 'sync-contact-portrait-consumers',
    collectionSlug: 'contact-portraits',
    schedule: [nightly],
  }),
  createSyncDocumentConsumerTitles({
    taskSlug: 'sync-document-consumers',
    collectionSlug: 'documents',
    schedule: [nightly],
  }),
  createSyncDocumentConsumerTitles({
    taskSlug: 'sync-media-consumers',
    collectionSlug: 'media',
    schedule: [nightly],
  }),
];
