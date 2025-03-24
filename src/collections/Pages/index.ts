import { adminOrPublished } from '@/access';
import { admin } from '@/access/admin';
import { CollectionConfig } from 'payload';

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: admin,
    delete: admin,
    read: adminOrPublished,
    update: admin,
  },
};
