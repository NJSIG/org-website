import { editor, editorOrPublished } from '@/access';
import { slugField } from '@/fields/slug';
import { populatePublishedAtHook } from '@/hooks';
import { CollectionConfig } from 'payload';
import { revalidateEventDeleteHook, revalidateEventHook } from './hooks';

export const Events: CollectionConfig<'events'> = {
  slug: 'events',
  access: {
    create: editor,
    delete: editor,
    read: editorOrPublished,
    update: editor,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
    startDate: true,
    startTime: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The title of the page, used for routing, SEO, tabs, and the admin UI.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Formatting options are limited to maintain consistency across the site.',
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
          hasMany: true,
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
          admin: {
            description: 'Select all the categories that apply to this event.',
            width: '50%',
          },
        },
        {
          name: 'contact',
          type: 'relationship',
          relationTo: 'contacts',
          required: true,
          admin: {
            description: 'The contact person for the event.',
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField('title', {
      slugOverrides: {
        unique: false,
        admin: {
          description: 'Event slugs are not unique, as even URLs include the event date.',
        },
      },
    }),
  ],
  defaultSort: '-startDate',
  hooks: {
    beforeChange: [populatePublishedAtHook],
    afterChange: [revalidateEventHook],
    afterDelete: [revalidateEventDeleteHook],
  },
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
    defaultColumns: ['title', 'startDate', 'contact', 'category'],
    useAsTitle: 'title',
  },
};
