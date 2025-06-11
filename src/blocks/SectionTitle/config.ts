import { Block } from 'payload';

export const SectionTitle: Block = {
  slug: 'sectionTitle',
  interfaceName: 'SectionTitleBlock',
  fields: [
    {
      name: 'theme',
      type: 'text',
      required: true,
      admin: {
        description: 'The theme is displayed as a pre-title above the main title.',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The main title of the section.',
      },
    },
    {
      name: 'viewOptions',
      type: 'select',
      defaultValue: 'titleAndTheme',
      required: true,
      options: [
        {
          label: 'Title and Theme',
          value: 'titleAndTheme',
        },
        {
          label: 'Title Only',
          value: 'titleOnly',
        },
        {
          label: 'Theme Only',
          value: 'themeOnly',
        },
      ],
      admin: {
        description: 'You can choose to visually hide the theme or title.',
        isClearable: false,
      },
    },
  ],
};
