import { Block } from 'payload';

export const HiddenTitle: Block = {
  slug: 'hiddenTitle',
  interfaceName: 'HiddenTitleBlock',
  admin: {
    group: 'Titles & Headings',
    images: {
      thumbnail: {
        url: '/blocks/hidden-title/thumb.png',
        alt: 'Hidden Title',
      },
      icon: {
        url: '/blocks/hidden-title/icon.svg',
        alt: 'Hidden Title',
      },
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description:
          'A visually hidden title for accessibility purposes. This should only be used if there is no visible title on the page.',
      },
    },
  ],
};
