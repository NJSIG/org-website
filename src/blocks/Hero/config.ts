import { linkField } from '@/fields/link';
import { Block } from 'payload';

export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    {
      name: 'slides',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'image',
          type: 'select',
          required: true,
          admin: {
            isClearable: false,
            // TODO: Custom component to display the selected image
          },
          options: [
            {
              label: 'Yellow Classroom',
              value: 'yellow-classroom',
            },
            {
              label: 'Call Center',
              value: 'call-center',
            },
          ],
        },
        {
          name: 'theme',
          type: 'text',
          required: true,
          admin: {
            description: 'Themes are displayed as a smaller title above the headline.',
          },
        },
        {
          name: 'headline',
          type: 'text',
          required: true,
          admin: {
            description: 'The main title of the slide.',
          },
        },
        linkField({
          appearances: ['cta'],
          variants: {
            styles: ['flat'],
            colors: ['primary', 'accent'],
            sizes: false,
            icons: false,
            microInteractions: false,
          },
          destinations: ['reference'],
          disableNewTab: true,
          overrides: {
            name: 'heroLink',
            label: 'Call to Action',
          },
        }),
      ],
    },
  ],
};
