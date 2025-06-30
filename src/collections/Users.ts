import { admin, editor } from '@/access';
import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    create: admin,
    delete: admin,
    read: editor,
    update: admin,
  },
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'User', value: 'user' },
      ],
      required: true,
      defaultValue: 'user',
    },
  ],
};
