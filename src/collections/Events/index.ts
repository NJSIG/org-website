import { editor, editorOrPublished } from '@/access';
import { populatePublishedAtHook } from '@/collections/hooks/populatePublishedAtHook';
import { nullEmptyFieldHook } from '@/fields/hooks/nullEmptyFieldHook';
import { resourceField } from '@/fields/Resource';
import { resourceGroupField } from '@/fields/ResourceGroup';
import { slugField } from '@/fields/Slug';
import { uiMapField } from '@/fields/UIMap';
import { CollectionConfig } from 'payload';
import { nullUnusedFieldsHook } from './hooks/nullUnusedFieldsHook';
import { populateResourceCountHook } from './hooks/populateResourceCountHook';
import { revalidateEventDeleteHook } from './hooks/revalidateEventDeleteHook';
import { revalidateEventHook } from './hooks/revalidateEventHook';
import { AttendanceOptions, EventTypes } from './types';

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
    eventType: true,
    slug: true,
    startDate: true,
    startTime: true,
  },
  fields: [
    {
      name: 'eventType',
      type: 'select',
      required: true,
      index: true,
      options: Object.values(EventTypes),
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
      localized: true,
      admin: {
        description: 'The title of the page, used for routing, SEO, tabs, and the admin UI.',
      },
    },
    {
      name: 'presentationTitle',
      type: 'text',
      localized: true,
      admin: {
        description:
          'The title of the presentation, falls back to the event title if not provided.',
        condition: (_, siblingData) =>
          siblingData.eventType !== EventTypes.TrusteeMeeting.value &&
          siblingData.eventType !== EventTypes.ImportantDate.value,
      },
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      admin: {
        description: 'Formatting options are limited to maintain consistency across the site.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'presenters',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'title',
              type: 'text',
              admin: {
                description: 'Title or Affiliation',
              },
              hooks: {
                beforeChange: [nullEmptyFieldHook],
              },
            },
          ],
          maxRows: 3,
          admin: {
            description: 'Persons or organizations presenting the main topic',
            initCollapsed: true,
            components: {
              RowLabel: '@/collections/Events/EventDynamicLabels',
            },
          },
          hooks: {
            beforeChange: [nullUnusedFieldsHook],
          },
        },
        {
          name: 'credits',
          type: 'array',
          localized: true,
          fields: [
            {
              name: 'credit',
              type: 'text',
              required: true,
              hooks: {
                beforeChange: [nullEmptyFieldHook],
              },
            },
          ],
          maxRows: 3,
          admin: {
            description: 'QPA or other credits',
            initCollapsed: true,
            components: {
              RowLabel: '@/collections/Events/EventDynamicLabels',
            },
          },
          hooks: {
            beforeChange: [nullUnusedFieldsHook],
          },
        },
      ],
      admin: {
        condition: (_, siblingData) =>
          siblingData.eventType !== EventTypes.TrusteeMeeting.value &&
          siblingData.eventType !== EventTypes.ImportantDate.value,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
          index: true,
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
            condition: (_, siblingData) => siblingData.eventType !== EventTypes.ImportantDate.value,
          },
          hooks: {
            beforeChange: [nullUnusedFieldsHook],
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
            condition: (_, siblingData) => siblingData.eventType !== EventTypes.ImportantDate.value,
          },
          hooks: {
            beforeChange: [nullUnusedFieldsHook],
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
            condition: (_, siblingData) => siblingData.eventType !== EventTypes.ImportantDate.value,
          },
          hooks: {
            beforeChange: [nullUnusedFieldsHook],
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'categories',
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
          label: 'NJSIG Organizer',
          required: true,
          admin: {
            description: 'The contact person for the event.',
            condition: (_, siblingData) => siblingData.eventType !== EventTypes.ImportantDate.value,
          },
          hooks: {
            beforeChange: [nullUnusedFieldsHook],
          },
        },
      ],
    },
    // Location & Attendance Group
    {
      type: 'group',
      label: 'Location & Attendance',
      admin: {
        hideGutter: true,
        condition: (_, siblingData) => siblingData.eventType !== EventTypes.ImportantDate.value,
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
              defaultValue: AttendanceOptions.InPerson.value,
              options: Object.values(AttendanceOptions),
              admin: {
                width: '50%',
                isClearable: false,
              },
            },
            {
              type: 'row',
              admin: {
                condition: (_, siblingData) =>
                  siblingData.attendanceOptions !== AttendanceOptions.InPerson.value,
              },
              fields: [
                {
                  name: 'virtualLinkType',
                  type: 'select',
                  options: [
                    { label: 'Meeting', value: 'meeting' },
                    { label: 'Registration', value: 'registration' },
                  ],
                  defaultValue: 'meeting',
                  hooks: {
                    beforeChange: [nullUnusedFieldsHook],
                  },
                },
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
                  hooks: {
                    beforeChange: [nullUnusedFieldsHook],
                  },
                },
              ],
            },
            {
              type: 'row',
              admin: {
                condition: (_, siblingData) =>
                  siblingData.attendanceOptions !== AttendanceOptions.InPerson.value,
              },
              fields: [
                {
                  name: 'virtualLink',
                  label: 'Meeting Link',
                  type: 'text',
                  admin: {
                    description:
                      'The link to the virtual event. If no link is provided, it will be displayed as "TBA" on the event page.',
                    width: '70%',
                  },
                  hooks: {
                    beforeChange: [nullUnusedFieldsHook],
                  },
                },
                {
                  name: 'virtualPasscode',
                  label: 'Meeting Passcode',
                  type: 'text',
                  admin: {
                    width: '30%',
                  },
                  hooks: {
                    beforeChange: [nullUnusedFieldsHook],
                  },
                },
              ],
            },
            {
              type: 'group',
              admin: {
                hideGutter: true,
                condition: (_, siblingData) =>
                  siblingData.attendanceOptions !== AttendanceOptions.Virtual.value,
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
                    beforeChange: [nullUnusedFieldsHook],
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
    // Trustee Meeting Agenda Group - Only Shows for Trustee Meetings
    {
      name: 'trusteeMeetingAgenda',
      type: 'group',
      admin: {
        description:
          'The meeting agenda file provided here will be displayed on the event page and the legal notices page.',
        hideGutter: true,
        condition: (_, siblingData) => siblingData.eventType === EventTypes.TrusteeMeeting.value,
      },
      fields: [
        resourceField({
          resourceTypes: ['document'],
          forceIcon: 'notebook-text',
          overrides: {
            label: '',
          },
        }),
      ],
    },
    // Trustee Meeting Minutes Group - Only Shows for Trustee Meetings
    {
      name: 'trusteeMeetingMinutes',
      type: 'group',
      admin: {
        description:
          'The meeting minutes summary and file provided here will be displayed on the event page and the legal notices page.',
        hideGutter: true,
        condition: (_, siblingData) => siblingData.eventType === EventTypes.TrusteeMeeting.value,
      },
      fields: [
        {
          name: 'minutesSummary',
          type: 'richText',
          admin: {
            description: 'A brief summary of the trustee meeting minutes (optional).',
          },
        },
        resourceField({
          resourceTypes: ['document'],
          forceIcon: 'file-text',
          overrides: {
            label: '',
          },
        }),
      ],
    },
    // Resources Group - Only shows when not a Trustee Meeting
    resourceGroupField({
      overrides: {
        group: {
          admin: {
            condition: (_, siblingData) =>
              siblingData.eventType !== EventTypes.TrusteeMeeting.value,
          },
        },
        row: {
          label: '', // Hide the row label
        },
      },
    }),
    // Sidebar Fields
    {
      name: 'important',
      type: 'checkbox',
      admin: {
        description: 'Mark this event as important to emphasize its significance.',
        position: 'sidebar',
        condition: (_, siblingData) => siblingData.eventType !== EventTypes.ImportantDate.value,
      },
    },
    ...slugField('title', {
      slugOverrides: {
        unique: false,
        admin: {
          description: 'Event slugs are not unique, as event URLs include the event date.',
        },
      },
    }),
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'lastUpdatedAt',
      type: 'date',
      virtual: 'updatedAt',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    // Helper Fields
    {
      name: 'resourceCount',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
        hidden: true,
      },
      hooks: {
        beforeChange: [populateResourceCountHook],
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
