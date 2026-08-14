import { admin, editor } from '@/access';
import { User } from '@/payload-types';
import { GlobalConfig } from 'payload';

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: editor,
    readVersions: editor,
    update: admin,
  },
  admin: {
    group: 'Administration',
    description: 'Global settings for forms and functionality.',
    hidden: ({ user }) => {
      if (!user) {
        return true;
      }

      return (user as User).role !== 'admin';
    },
  },
  fields: [
    {
      type: 'group',
      name: 'froi',
      label: 'FROI Intake Form Settings',
      admin: {
        description:
          'Functionality for the FROI Intake Form, including notification settings and mail templates.',
      },
      fields: [
        {
          type: 'group',
          name: 'confirmationEmail',
          label: 'Confirmation Email',
          fields: [
            {
              type: 'checkbox',
              name: 'enabled',
              label:
                'Send a confirmation email to the user after they submit the FROI Intake Form.',
            },
            {
              type: 'checkbox',
              name: 'copyClaimant',
              label: 'Copy the claimant on the confirmation email.',
            },
          ],
        },
      ],
    },
  ],
};
