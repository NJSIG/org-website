import { Block } from 'payload';

export enum CollectionSlugs {
  Events = 'events',
  Contracting = 'contracting',
  LegalNotices = 'legal-notices',
}

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
      name: 'collection',
      type: 'select',
      required: true,
      options: [
        { label: 'Events', value: CollectionSlugs.Events },
        { label: 'Contracting', value: CollectionSlugs.Contracting },
        { label: 'Legal Notices', value: CollectionSlugs.LegalNotices },
      ],
      admin: {
        isClearable: false,
        description: 'Select the collection to display in this list.',
      },
    },
    // Event Specific Fields
    {
      type: 'group',
      fields: [
        {
          name: 'eventTypeFilter',
          type: 'relationship',
          relationTo: 'event-types',
          hasMany: true,
          admin: {
            description:
              'Filter events by selecting one or more event types. If no event types are selected, all events will be shown.',
          },
        },
      ],
      admin: {
        condition: (_, siblingData) => siblingData.collection === CollectionSlugs.Events,
      },
    },
  ],
};
