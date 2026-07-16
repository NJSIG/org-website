import { plausibleCustomEventField } from '@/fields/Analytics/plausibleCustomEvent';
import { createUpdateConsumedDocumentHook } from '@/fields/hooks/createUpdateConsumedDocumentHook';
import { linkField } from '@/fields/Link';
import { uiTipField } from '@/fields/UITip';
import { Block } from 'payload';

export const HeroSpinner: Block = {
  slug: 'heroSpinner',
  interfaceName: 'HeroSpinnerBlock',
  admin: {
    group: 'Titles & Headings',
    images: {
      thumbnail: {
        url: '/blocks/hero-spinner/thumb.png',
        alt: 'Hero Spinner',
      },
      icon: {
        url: '/blocks/hero-spinner/icon.svg',
        alt: 'Hero Spinner',
      },
    },
  },
  fields: [
    uiTipField([
      'Hero Spinner is a special display heading. A Hidden Title should be used for accessibility.',
    ]),
    {
      name: 'slideTimeout',
      label: 'Slide Timeout (seconds)',
      type: 'number',
      required: true,
      defaultValue: 5,
      admin: {
        description: 'Time in seconds before automatically transitioning to the next slide.',
      },
    },
    {
      name: 'slides',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/blocks/HeroSpinner/admin/SlideLabel',
        },
      },
      fields: [
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'hero-images',
          required: true,
          hooks: {
            afterChange: [createUpdateConsumedDocumentHook('title')],
          },
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
            fields: [plausibleCustomEventField()],
          },
        }),
      ],
    },
  ],
};
