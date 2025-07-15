import { editor, editorOrPublished } from '@/access';
import { resourceGroupField } from '@/fields/resourceGroup';
import { slugField } from '@/fields/slug';
import { uiMapField } from '@/fields/uiMap';
import { populatePublishedAtHook } from '@/hooks';
import { CollectionConfig } from 'payload';
import { revalidateEventDeleteHook, revalidateEventHook } from './hooks';
import { clearLocationHook } from './hooks/clearLocationHook';

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
          type: 'relationship',
          relationTo: 'event-categories',
          required: true,
          hasMany: true,
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
      type: 'row',
      fields: [
        {
          type: 'group',
          fields: [
            {
              name: 'type',
              label: 'Event Type',
              type: 'select',
              required: true,
              defaultValue: 'in-person',
              options: [
                { label: 'In-Person', value: 'in-person' },
                { label: 'Virtual', value: 'virtual' },
                { label: 'Hybrid', value: 'hybrid' },
              ],
              admin: {
                description:
                  'Virtual event details should be provided in the description or other communications.',
                width: '50%',
                isClearable: false,
              },
            },
            {
              name: 'location',
              label: 'Physical Location',
              type: 'relationship',
              relationTo: 'locations',
              admin: {
                description:
                  'If no location is selected it will be displayed as "TBA" on the event page.',
                width: '50%',
                condition: (_, siblingData) => siblingData.type !== 'virtual',
              },
              hooks: {
                beforeChange: [clearLocationHook],
              },
            },
          ],
          admin: {
            hideGutter: true,
          },
        },
        uiMapField({
          admin: {
            condition: (_, siblingData) => siblingData.type !== 'virtual',
          },
        }),
      ],
    },
    resourceGroupField({
      overrides: {
        row: {
          label: '', // Hide the row label
        },
      },
    }),
    {
      name: 'important',
      type: 'checkbox',
      admin: {
        description: 'Mark this event as important to emphasize its significance.',
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
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
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
