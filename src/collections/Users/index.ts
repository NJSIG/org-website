import { admin, editor } from '@/access';
import { User } from '@/payload-types';
import type { CollectionConfig } from 'payload';
import { syncBetterAuthHook } from './hooks/syncBetterAuthHook';
import { betterAuthStrategy } from './lib/authStrategy';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    disableLocalStrategy: true,
    strategies: [betterAuthStrategy],
  },
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
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
        },
        {
          name: 'fullName',
          type: 'text',
          virtual: true,
          admin: {
            hidden: true,
          },
          hooks: {
            afterRead: [
              ({ siblingData }) => {
                return siblingData.firstName && siblingData.lastName
                  ? `${siblingData.firstName} ${siblingData.lastName}`.trim()
                  : null;
              },
            ],
          },
        },
      ],
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Intake', value: 'intake' },
        { label: 'OPRA', value: 'opra' },
        { label: 'User', value: 'user' },
      ],
      required: true,
      defaultValue: 'user',
    },
  ],
  hooks: {
    afterChange: [syncBetterAuthHook],
  },
};
