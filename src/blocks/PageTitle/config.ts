import { uiTipField } from '@/fields/UITip';
import { Block } from 'payload';

export const PageTitle: Block = {
  slug: 'pageTitle',
  interfaceName: 'PageTitleBlock',
  imageURL: '/blocks/page-title.png',
  imageAltText: 'Page Title Block',
  fields: [
    uiTipField([
      'Page Title is a basic heading block. For more complex display headings, consider using the Banner Title block.',
    ]),
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: {
        description: 'The subtitle is displayed below the main title in a smaller font size.',
      },
    },
  ],
};
