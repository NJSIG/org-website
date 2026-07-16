import { createUpdateConsumedDocumentHook } from '@/fields/hooks/createUpdateConsumedDocumentHook';
import { uiTipField } from '@/fields/UITip';
import { Block } from 'payload';

export const BannerTitle: Block = {
  slug: 'bannerTitle',
  interfaceName: 'BannerTitleBlock',
  admin: {
    group: 'Titles & Headings',
    images: {
      thumbnail: {
        url: '/blocks/banner-title/thumb.png',
        alt: 'Banner Title',
      },
      icon: {
        url: '/blocks/banner-title/icon.svg',
        alt: 'Banner Title',
      },
    },
  },
  fields: [
    uiTipField([
      'Banner Title is a special display heading. A Hidden Title should be used for accessibility.',
    ]),
    {
      name: 'theme',
      type: 'text',
      admin: {
        description: 'The theme is displayed as a pre-title above the main title.',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The title to display.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'hero-images',
      required: true,
      admin: {
        description:
          'Banner Title uses Hero Images for greater control over the final result across screen sizes.',
      },
      hooks: {
        afterChange: [createUpdateConsumedDocumentHook('title')],
      },
    },
  ],
};
