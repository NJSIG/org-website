import { editor, editorOrPublished } from '@/access';
import { CollectionConfig } from 'payload';

export const Events: CollectionConfig<'events'> = {
  slug: 'events',
  access: {
    create: editor,
    delete: editor,
    read: editorOrPublished,
    update: editor,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The title of the event, SEO, tabs, and the admin UI.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'MMM d, yyy',
            },
          },
        },
        {
          name: 'endDate',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'MMM d, yyy',
            },
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'registrationTime',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'timeOnly',
              displayFormat: 'h:mm a',
            },
          },
        },
        {
          name: 'startTime',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'timeOnly',
              displayFormat: 'h:mm a',
            },
          },
        },
        {
          name: 'endTime',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'timeOnly',
              displayFormat: 'h:mm a',
            },
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          required: true,
          options: [
            { label: 'NJSIG', value: 'njsig' },
            { label: 'BACCEIC', value: 'bacceic' },
            { label: 'CAIP', value: 'caip' },
            { label: 'ERIC North', value: 'eric-north' },
            { label: 'ERIC South', value: 'eric-south' },
            { label: 'ERIC West', value: 'eric-west' },
            { label: 'MOCSSIF', value: 'mocssif' },
            { label: 'NJEIF', value: 'njeif' },
            { label: 'Other', value: 'other' },
          ],
        },
      ],
    },
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 10,
  },
  admin: {
    defaultColumns: ['title', 'startDate'],
    useAsTitle: 'title',
  },
};
