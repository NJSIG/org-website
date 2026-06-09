import { AttendanceOptions, EventTypes } from '@/collections/Events/types';
import { Block } from 'payload';

const ListableCollections = {
  Contacts: { label: 'Contacts', value: 'contacts' },
  // Contracting: { label: 'RFPs', value: 'rfps' },
  Events: { label: 'Events', value: 'events' },
  // LegalNotices: { label: 'Legal Notices', value: 'legal-notices' },
} as const;

type ListableCollections = keyof typeof ListableCollections;

export const CollectionList: Block = {
  slug: 'collectionList',
  interfaceName: 'CollectionListBlock',
  admin: {
    group: 'Lists',
    images: {
      thumbnail: {
        url: '/blocks/collection-list/thumb.png',
        alt: 'Collection List',
      },
      icon: {
        url: '/blocks/collection-list/icon.svg',
        alt: 'Collection List',
      },
    },
  },
  fields: [
    {
      name: 'listableCollection',
      label: 'Collection',
      type: 'select',
      required: true,
      options: Object.values(ListableCollections),
      admin: {
        isClearable: false,
        description: 'Select the collection to display in this list.',
      },
    },

    // ---
    // Contact Specific Fields
    // ---
    {
      type: 'group',
      name: 'contactFilters',
      fields: [
        {
          name: 'contacts',
          type: 'relationship',
          relationTo: 'contacts',
          hasMany: true,
          admin: {
            description: 'Drag contacts to rearrange their order in the list.',
          },
        },
        {
          name: 'columns',
          type: 'select',
          required: true,
          options: [
            { label: '2 Columns', value: '2' },
            { label: '3 Columns', value: '3' },
          ],
          defaultValue: '2',
          admin: {
            isClearable: false,
            description:
              'Choose the number of columns for the contact list. The layout will automatically adjust to the screen width.',
          },
        },
        {
          name: 'squareGrid',
          type: 'checkbox',
          label: 'Include a placeholder to maintain a square grid layout?',
        },
      ],
      admin: {
        condition: (_, siblingData) =>
          siblingData.listableCollection === ListableCollections.Contacts.value,
      },
    },

    // ---
    // Contracting Specific Fields
    // ---

    // ---
    // Event Specific Fields
    // ---
    {
      type: 'group',
      name: 'eventFilters',
      fields: [
        {
          name: 'types',
          type: 'select',
          hasMany: true,
          options: Object.values(EventTypes),
          admin: {
            description:
              'Select one or more event types to display in the list, leave empty to show all event types.',
          },
        },
        {
          name: 'attendanceOptions',
          type: 'select',
          hasMany: true,
          options: Object.values(AttendanceOptions),
          admin: {
            description:
              'Select one or more attendance options to display in the list, leave empty to show all attendance options.',
          },
        },
        {
          name: 'categories',
          type: 'relationship',
          relationTo: 'event-categories',
          hasMany: true,
          admin: {
            allowCreate: false,
            allowEdit: false,
            description:
              'Select one or more event categories to display in the list, leave empty to show all categories.',
          },
        },
        {
          name: 'dateRange',
          type: 'select',
          options: [
            { label: 'All Events', value: 'all' },
            { label: 'Upcoming Events', value: 'upcoming' },
            { label: 'Past Events', value: 'past' },
            { label: 'Custom Range', value: 'custom' },
          ],
          admin: {
            description: 'Select the date range for the events to display in the list.',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'rangeStart',
              type: 'date',
              required: true,
              admin: {
                description: 'Start date for the custom date range.',
                width: '50%',
              },
            },
            {
              name: 'rangeEnd',
              type: 'date',
              admin: {
                description: 'End date for the custom date range. Leave empty to have no end date.',
                width: '50%',
              },
            },
          ],
          admin: {
            condition: (_, siblingData) => siblingData.dateRange === 'custom',
          },
        },
        {
          name: 'pagination',
          type: 'select',
          options: [
            { label: 'Show All', value: 'all' },
            { label: 'Paginate by Count', value: 'paginateCount' },
            { label: 'Paginate by Calendar Year', value: 'paginateYear' },
            { label: 'Paginate by Program Year', value: 'paginateProgramYear' },
          ],
          defaultValue: 'paginateYear',
          admin: {
            isClearable: false,
            description:
              'Choose how to paginate the event list. "Paginate by Program Year" will group events based on the NJSIG program year (July 1 - June 30).',
          },
        },
      ],
      admin: {
        condition: (_, siblingData) =>
          siblingData.listableCollection === ListableCollections.Events.value,
      },
    },

    // ---
    // Legal Notice Specific Fields
    // ---
  ],
};
