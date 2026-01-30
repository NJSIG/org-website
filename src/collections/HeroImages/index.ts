import { anyone, editor } from '@/access';
import { computeBlurDataHook } from '@/hooks/computeBlurDataHook';
import { populateTitleFromFileHook } from '@/hooks/populateTitleFromFileHook';
import { createSnakeCaseUploadsHook } from '@/hooks/snakeCaseUploadsHook';
import { imageNameGenerators } from '@/utilities/imageNameGenerator';
import { CollectionConfig, ImageUploadFormatOptions } from 'payload';
import { resetPositionData } from './hooks/resetPositionData';
import { validateHorizontalValues } from './hooks/validateHorizontalValues';
import { validateVerticalValues } from './hooks/validateVerticalValues';

const webp: ImageUploadFormatOptions = {
  format: 'webp',
  options: {
    quality: 90,
  },
};

export const HeroImages: CollectionConfig = {
  slug: 'hero-images',
  access: {
    create: editor,
    delete: editor,
    read: anyone,
    update: editor,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'If left blank the title will be generated from the file name.',
      },
    },
    {
      name: 'alt',
      label: 'Alt Text',
      type: 'text',
      localized: true,
      required: true,
      admin: {
        description:
          'Alt text is important for accessibility and SEO. Describe the image as specifically and briefly as possible.',
      },
    },
    {
      type: 'group',
      name: 'customPositioning',
      label: 'Custom Positioning',
      admin: {
        description: 'Adjust the positioning of the image within its container across breakpoints.',
      },
      fields: [
        {
          type: 'group',
          name: 'smallScreens',
          label: 'Small Screens',
          fields: [
            {
              type: 'checkbox',
              name: 'enabled',
              label: 'Enable for Small Screens',
            },
            {
              type: 'row',
              fields: [
                {
                  type: 'text',
                  name: 'xPos',
                  label: 'Horizontal Position',
                  admin: {
                    width: '50%',
                    placeholder: 'e.g., 20%, center, 150px',
                    description:
                      'Use left, center, right, or a value in %, em, rem, or px. Defaults to center.',
                    condition: (_, siblingData) => siblingData.enabled,
                  },
                  validate: validateHorizontalValues,
                  hooks: {
                    beforeChange: [resetPositionData],
                  },
                },
                {
                  type: 'text',
                  name: 'yPos',
                  label: 'Vertical Position',
                  admin: {
                    width: '50%',
                    placeholder: 'e.g., 20%, center, 150px',
                    description:
                      'Use top, center, bottom, or a value in %, em, rem, or px. Defaults to bottom.',
                    condition: (_, siblingData) => siblingData.enabled,
                  },
                  validate: validateVerticalValues,
                  hooks: {
                    beforeChange: [resetPositionData],
                  },
                },
              ],
            },
          ],
        },
        {
          type: 'group',
          name: 'mediumScreens',
          label: 'Medium Screens',
          fields: [
            {
              type: 'checkbox',
              name: 'enabled',
              label: 'Enable for Medium Screens',
            },
            {
              type: 'row',
              fields: [
                {
                  type: 'text',
                  name: 'xPos',
                  label: 'Horizontal Position',
                  admin: {
                    width: '50%',
                    placeholder: 'e.g., 20%, center, 150px',
                    description:
                      'Use left, center, right, or a value in %, em, rem, or px. Defaults to center.',
                    condition: (_, siblingData) => siblingData.enabled,
                  },
                  validate: validateHorizontalValues,
                  hooks: {
                    beforeChange: [resetPositionData],
                  },
                },
                {
                  type: 'text',
                  name: 'yPos',
                  label: 'Vertical Position',
                  admin: {
                    width: '50%',
                    placeholder: 'e.g., 20%, center, 150px',
                    description:
                      'Use top, center, bottom, or a value in %, em, rem, or px. Defaults to bottom.',
                    condition: (_, siblingData) => siblingData.enabled,
                  },
                  validate: validateVerticalValues,
                  hooks: {
                    beforeChange: [resetPositionData],
                  },
                },
              ],
            },
          ],
        },
        {
          type: 'group',
          name: 'largeScreens',
          label: 'Large Screens',
          fields: [
            {
              type: 'checkbox',
              name: 'enabled',
              label: 'Enable for Large Screens',
            },
            {
              type: 'row',
              fields: [
                {
                  type: 'text',
                  name: 'xPos',
                  label: 'Horizontal Position',
                  admin: {
                    width: '50%',
                    placeholder: 'e.g., 20%, center, 150px',
                    description:
                      'Use left, center, right, or a value in %, em, rem, or px. Defaults to center.',
                    condition: (_, siblingData) => siblingData.enabled,
                  },
                  validate: validateHorizontalValues,
                  hooks: {
                    beforeChange: [resetPositionData],
                  },
                },
                {
                  type: 'text',
                  name: 'yPos',
                  label: ' Vertical Position',
                  admin: {
                    width: '50%',
                    placeholder: 'e.g., 20%, center, 150px',
                    description:
                      'Use top, center, bottom, or a value in %, em, rem, or px. Defaults to bottom.',
                    condition: (_, siblingData) => siblingData.enabled,
                  },
                  validate: validateVerticalValues,
                  hooks: {
                    beforeChange: [resetPositionData],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'blurData',
      label: 'Blur Data',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Used for image placeholders. Automatically generated from the image.',
      },
    },
  ],
  admin: {
    defaultColumns: ['filename', 'title', 'alt'],
    group: 'Media',
  },
  trash: true,
  disableDuplicate: true,
  upload: {
    pasteURL: false,
    skipSafeFetch: [
      {
        hostname: 'localhost',
      },
      {
        hostname: process.env.SAFE_FETCH_ALLOW!,
      },
    ],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 180,
        formatOptions: {
          ...webp,
          options: {
            quality: 60,
          },
        },
        generateImageName: imageNameGenerators.bySize,
      },
      {
        name: 'optimized',
        formatOptions: webp,
        generateImageName: imageNameGenerators.bySize,
      },
      {
        name: 'xs',
        width: 640,
        height: 360,
        formatOptions: {
          ...webp,
          options: {
            quality: 75,
          },
        },
        generateImageName: imageNameGenerators.byWidth,
      },
      {
        name: 'sm',
        width: 960,
        height: 540,
        formatOptions: {
          ...webp,
          options: {
            quality: 80,
          },
        },
        generateImageName: imageNameGenerators.byWidth,
      },
      {
        name: 'md',
        width: 1280,
        height: 720,
        formatOptions: webp,
        generateImageName: imageNameGenerators.byWidth,
      },
      {
        name: 'lg',
        width: 1920,
        height: 1080,
        formatOptions: webp,
        generateImageName: imageNameGenerators.byWidth,
      },
      {
        name: 'xl',
        width: 2400,
        height: 1350,
        formatOptions: webp,
        generateImageName: imageNameGenerators.byWidth,
      },
    ],
  },
  hooks: {
    beforeOperation: [createSnakeCaseUploadsHook('hero-images')],
    beforeChange: [computeBlurDataHook, populateTitleFromFileHook],
  },
};
