import { Block } from 'payload';

export const EventCards: Block = {
  slug: 'eventCards',
  interfaceName: 'EventCardsBlock',
  labels: {
    singular: 'Event Cards',
    plural: 'Event Cards',
  },
  imageURL: '/blocks/event-cards.png',
  imageAltText: 'Event Cards Block',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'cards',
          label: 'Number of Cards',
          type: 'number',
          min: 1,
          max: 4,
          defaultValue: 3,
          required: true,
          admin: {
            description: 'Set the number of cards to display, including the "View All" card',
          },
        },
        {
          name: 'categoryFilters',
          label: 'Filter by Category',
          type: 'relationship',
          relationTo: 'event-categories',
          hasMany: true,
          admin: {
            description:
              'Select categories to filter events by. Leave empty to show all events. NJSIG events flagged as "Important" will always be shown.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'showViewAll',
          label: 'Show "View All" Card',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Toggle to show or hide the "View All" card at the end of the list.',
          },
        },
        {
          name: 'enableSubscribe',
          label: 'Enable Subscribe Card',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable the "Subscribe" card when there are no events to display.',
          },
        },
      ],
    },
  ],
};
