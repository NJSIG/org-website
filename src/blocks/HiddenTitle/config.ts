import { Block } from 'payload';

export const HiddenTitle: Block = {
  slug: 'hiddenTitle',
  interfaceName: 'HiddenTitleBlock',
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
