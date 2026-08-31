import { admin, editor } from '@/access';
import { getAuth } from '@/lib/auth';
import { User } from '@/payload-types';
import { randomBytes } from 'crypto';
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
        { label: 'User', value: 'user' },
      ],
      required: true,
      defaultValue: 'user',
    },
  ],
  hooks: {
    afterChange: [
      // Sync user to Better Auth
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          const auth = await getAuth();

          await auth.api.createUser({
            body: {
              email: doc.email,
              name: `${doc.firstName} ${doc.lastName}`.trim(),
              password: randomBytes(24).toString('hex'), // Never surfaced to the user
              role: 'user', // This is the Better Auth role, not the CMS role
            },
          });

          // TODO: Trigger first sign in email with Magic Link or Email-OTP for password creation
        }
      },
    ],
  },
};
