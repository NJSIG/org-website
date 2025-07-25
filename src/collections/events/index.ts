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
      name: 'eventType',
      type: 'select',
      required: true,
      defaultValue: 'event',
      options: [
        { label: 'Event', value: 'event' },
        { label: 'Important Date', value: 'importantDate' },
      ],
      admin: {
        isClearable: false,
        description:
          'Select the type of event. Important Date is used for non-event dates like the renewal deadline.',
      },
    },
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
            condition: (_, siblingData) => siblingData.eventType === 'event',
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
            condition: (_, siblingData) => siblingData.eventType === 'event',
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
            condition: (_, siblingData) => siblingData.eventType === 'event',
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
          },
        },
        {
          name: 'contact',
          type: 'relationship',
          relationTo: 'contacts',
          required: true,
          admin: {
            description: 'The contact person for the event.',
            condition: (_, siblingData) => siblingData.eventType === 'event',
          },
        },
      ],
    },
    {
      type: 'group',
      admin: {
        hideGutter: true,
        condition: (_, siblingData) => siblingData.eventType === 'event',
      },
      fields: [
        {
          type: 'group',
          fields: [
            {
              name: 'attendanceOptions',
              label: 'Attendance Options',
              type: 'select',
              required: true,
              defaultValue: 'in-person',
              options: [
                { label: 'In-Person', value: 'in-person' },
                { label: 'Virtual', value: 'virtual' },
                { label: 'Hybrid', value: 'hybrid' },
              ],
              admin: {
                width: '50%',
                isClearable: false,
              },
            },
            {
              type: 'row',
              admin: {
                condition: (_, siblingData) => siblingData.attendanceOptions !== 'in-person',
              },
              fields: [
                {
                  name: 'virtualProvider',
                  type: 'select',
                  options: [
                    { label: 'Zoom', value: 'zoom' },
                    { label: 'Google Meet', value: 'googleMeet' },
                    { label: 'Microsoft Teams', value: 'microsoftTeams' },
                    { label: 'GoTo Meeting', value: 'goToMeeting' },
                    { label: 'Other', value: 'other' },
                  ],
                  defaultValue: 'zoom',
                  required: true,
                  admin: {
                    width: '20%',
                  },
                },
                {
                  name: 'virtualLink',
                  label: 'Meeting Link',
                  type: 'text',
                  admin: {
                    description:
                      'The link to the virtual event. If no link is provided, it will be displayed as "TBA" on the event page.',
                    width: '60%',
                  },
                },
                {
                  name: 'virtualPasscode',
                  label: 'Meeting Passcode',
                  type: 'text',
                  admin: {
                    width: '20%',
                  },
                },
              ],
            },
            {
              type: 'group',
              admin: {
                hideGutter: true,
                condition: (_, siblingData) => siblingData.attendanceOptions !== 'virtual',
              },
              fields: [
                {
                  name: 'location',
                  label: 'Physical Location',
                  type: 'relationship',
                  relationTo: 'locations',
                  admin: {
                    description:
                      'If no location is selected it will be displayed as "TBA" on the event page.',
                    width: '50%',
                  },
                  hooks: {
                    beforeChange: [clearLocationHook],
                  },
                },
                uiMapField(),
              ],
            },
          ],
          admin: {
            hideGutter: true,
          },
        },
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
        condition: (_, siblingData) => siblingData.eventType === 'event',
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
    defaultColumns: ['title', 'eventType', 'startDate', 'contact', 'category'],
    useAsTitle: 'title',
  },
};
