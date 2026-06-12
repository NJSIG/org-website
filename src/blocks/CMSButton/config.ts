import { plausibleCustomEventField } from '@/fields/Analytics/plausibleCustomEvent';
import { linkField } from '@/fields/Link';
import { Block } from 'payload';

export const CMSButton: Block = {
  slug: 'cmsButton',
  interfaceName: 'CMSButtonBlock',
  labels: {
    singular: 'CMS Button',
    plural: 'CMS Buttons',
  },
  admin: {
    group: 'Buttons & Content',
    images: {
      thumbnail: {
        url: '/blocks/cms-button/thumb.png',
        alt: 'CMS Button',
      },
      icon: {
        url: '/blocks/cms-button/icon.svg',
        alt: 'CMS Button',
      },
    },
  },
  fields: [
    linkField({
      appearances: ['button'],
      variants: {
        styles: ['outline'],
        colors: ['primary', 'accent'],
        sizes: false,
        icons: false,
      },
      destinations: ['reference'],
      disableNewTab: true,
      overrides: {
        name: 'cmsButtonLink',
        label: 'CMS Button Link',
        admin: {
          description:
            'Link to a CMS page or collection item. The button will render with an arrow-up-right icon after the label.',
        },
      },
    }),
    plausibleCustomEventField(),
  ],
};
