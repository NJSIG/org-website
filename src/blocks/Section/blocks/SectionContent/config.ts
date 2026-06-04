import { Block } from 'payload';

export const SectionContent: Block = {
  slug: 'sectionContent',
  interfaceName: 'SectionContentBlock',
  admin: {
    group: 'Buttons & Content',
    images: {
      thumbnail: {
        url: '/blocks/section-content/thumb.png',
        alt: 'Section Content',
      },
      icon: {
        url: '/blocks/section-content/icon.svg',
        alt: 'Section Content',
      },
    },
  },
  fields: [
    {
      name: 'centerBlock',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'If enabled, the content will be centered within the section.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'Formatting options are limited to maintain consistency across the site.',
      },
    },
  ],
};
