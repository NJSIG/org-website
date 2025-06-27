import { Block } from 'payload';

export const OptimizedImage: Block = {
  slug: 'optimizedImage',
  interfaceName: 'OptimizedImageBlock',
  imageURL: '/blocks/optimized-image.png',
  imageAltText: 'Optimized Image Block',
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
      name: 'priority',
      type: 'checkbox',
      label: 'Enable Priority',
      admin: {
        description:
          'Enabling this option will prioritize the loading of this image. This should only be used for "above the fold" images.',
      },
    },
  ],
};
