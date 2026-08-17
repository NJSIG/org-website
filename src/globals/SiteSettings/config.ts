import { admin, editor } from '@/access';
import { User } from '@/payload-types';
import { GlobalConfig, TextFieldSingleValidation } from 'payload';

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
          name: 'notificationEmail',
          admin: {
            description:
              'The website can send a notification email to defined mailboxes when a new form is submitted. This will supplement the notifications within the management screen.',
          },
          fields: [
            {
              type: 'checkbox',
              name: 'enabled',
              label: 'Send a notification email when a new FROI Intake Form is submitted.',
            },
            {
              type: 'text',
              name: 'template',
              label: 'Notification Email Template',
              validate: ((value, { siblingData }) => {
                const enabled = (siblingData as { enabled?: boolean })?.enabled;

                if (enabled && !value) {
                  return 'Email template is required when notification email is enabled.';
                }

                if (enabled && value && value.length > 50) {
                  return 'Email template cannot be more than 50 characters.';
                }

                return true;
              }) as TextFieldSingleValidation,
              admin: {
                description:
                  'The name of the email template defined in MailChimp Transactional (Mandrill).',
              },
            },
            {
              type: 'array',
              name: 'recipients',
              maxRows: 10,
              validate: (value, { siblingData }) => {
                const enabled = (siblingData as { enabled?: boolean })?.enabled;

                if (enabled && (!value || value.length === 0)) {
                  return 'At least one recipient is required when notification email is enabled.';
                }

                return true;
              },
              admin: {
                initCollapsed: true,
                description: 'Add up to 10 recipients for the notification email.',
                components: {
                  RowLabel: '@/globals/SiteSettings/admin/EmailRecipientRowLabel',
                },
              },
              fields: [
                {
                  type: 'text',
                  name: 'name',
                  required: true,
                },
                {
                  type: 'email',
                  name: 'email',
                  required: true,
                },
              ],
            },
          ],
        },
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
            {
              type: 'text',
              name: 'template',
              label: 'Confirmation Email Template',
              validate: ((value, { siblingData }) => {
                const enabled = (siblingData as { enabled?: boolean })?.enabled;

                if (enabled && !value) {
                  return 'Email template is required when confirmation email is enabled.';
                }

                if (enabled && value && value.length > 50) {
                  return 'Email template cannot be more than 50 characters.';
                }

                return true;
              }) as TextFieldSingleValidation,
              admin: {
                description:
                  'The name of the email template defined in MailChimp Transactional (Mandrill).',
              },
            },
          ],
        },
      ],
    },
  ],
};
