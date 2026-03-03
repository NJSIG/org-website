import { Block } from 'payload';

export const ImageCallout: Block = {
  slug: 'imageCallout',
  interfaceName: 'ImageCalloutBlock',
  imageURL: '/blocks/image-callout.png',
  imageAltText: 'Image Callout Block',
  fields: [
    {
      type: 'group',
      name: 'calloutContent',
      fields: [
        {
          name: 'theme',
          type: 'text',
          admin: {
            description: 'The theme is displayed as a title above the callout text.',
          },
        },
        {
          name: 'content',
          type: 'text',
          required: true,
          admin: {
            description: 'The content to display in the callout.',
          },
        },
        {
          name: 'position',
          type: 'select',
          defaultValue: 'left',
          required: true,
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ],
          admin: {
            isClearable: false,
          },
        },
      ],
    },
    {
      type: 'group',
      name: 'calloutImage',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          filterOptions: {
            mimeType: { contains: 'image' },
          },
          admin: {
            description:
              'You may specify a height and/or width to force a specific image size. Only set one or the other to maintain the image aspect ratio.',
          },
        },
        {
          name: 'border',
          type: 'select',
          defaultValue: 'none',
          required: true,
          options: [
            { label: 'None', value: 'none' },
            { label: 'Primary/Midtone', value: 'primaryMidtone' },
          ],
          admin: {
            isClearable: false,
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'width',
              label: 'Width in Pixels',
              type: 'number',
            },
            {
              name: 'height',
              label: 'Height in Pixels',
              type: 'number',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'priority',
              type: 'checkbox',
              label: 'Enable Priority',
              admin: {
                description:
                  'Enabling this option will prioritize the loading of this image. This should only be used for "above the fold" images.',
              },
            },
            {
              name: 'placeholder',
              type: 'checkbox',
              label: 'Enable Placeholder',
              defaultValue: true,
              admin: {
                description:
                  'Enabling this option will display a low-quality blurred image placeholder while the full image loads.',
              },
            },
          ],
        },
      ],
    },
  ],
};
