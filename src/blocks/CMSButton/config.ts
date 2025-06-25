import { linkField } from '@/fields/link';
import { Block } from 'payload';

export const CMSButton: Block = {
  slug: 'cmsButton',
  interfaceName: 'CMSButtonBlock',
  labels: {
    singular: 'CMS Button',
    plural: 'CMS Buttons',
  },
  imageURL: '/blocks/cms-button.png',
  imageAltText: 'CMS Button Block',
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
  ],
};
