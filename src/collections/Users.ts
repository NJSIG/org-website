import { admin, editor } from '@/access';
import { User } from '@/payload-types';
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
    group: 'Administration',
    hidden: ({ user }) => {
      if (!user) {
        return true;
      }

      return (user as User).role !== 'admin';
    },
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
