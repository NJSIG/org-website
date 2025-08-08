import { Block } from 'payload';

export const SectionContent: Block = {
  slug: 'sectionContent',
  interfaceName: 'SectionContentBlock',
  imageURL: '/blocks/section/section-content.png',
  imageAltText: 'Section Content Block',
  fields: [
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
