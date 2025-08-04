import { Block } from 'payload';

export const EventTiles: Block = {
  slug: 'eventTiles',
  interfaceName: 'EventTilesBlock',
  labels: {
    singular: 'Event Tiles',
    plural: 'Event Tiles',
  },
  imageURL: '/blocks/event-tiles.png',
  imageAltText: 'Event Tiles Block',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'tiles',
          label: 'Number of Tiles',
          type: 'number',
          min: 1,
          max: 4,
          defaultValue: 3,
          required: true,
          admin: {
            description: 'Set the number of tiles to display, including the "View All" tile',
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
          label: 'Show "View All" Tile',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Toggle to show or hide the "View All" tile at the end of the list.',
          },
        },
        {
          name: 'enableSubscribe',
          label: 'Enable Subscribe Tile',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description:
              'Enable the "Subscribe" tile when there are no events to display. NOTE: The subscribe functionality is still under development.',
          },
        },
      ],
    },
  ],
};
