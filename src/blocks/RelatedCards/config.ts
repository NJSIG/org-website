import { linkField } from '@/fields/Link';
import { Block } from 'payload';

export const RelatedCards: Block = {
  slug: 'relatedCards',
  labels: {
    singular: 'Related Cards',
    plural: 'Related Cards',
  },
  interfaceName: 'RelatedCardsBlock',
  admin: {
    group: 'Buttons & Content',
    images: {
      thumbnail: {
        url: '/blocks/related-cards/thumb.png',
        alt: 'Related Cards',
      },
      icon: {
        url: '/blocks/related-cards/icon.svg',
        alt: 'Related Cards',
      },
    },
  },
  fields: [
    {
      name: 'cards',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          maxLength: 50,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          maxLength: 250,
        },
        linkField({
          appearances: false,
          destinations: ['reference'],
          disableNewTab: true,
          disableLabel: true,
          required: true,
        }),
      ],
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/blocks/RelatedCards/ItemLabel',
        },
      },
    },
  ],
};
