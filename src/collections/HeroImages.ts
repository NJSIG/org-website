import { anyone, editor } from '@/access';
import { computeBlurDataHook, populateTitleFromFileHook, snakeCaseUploadsHook } from '@/hooks';
import { imageNameGenerators } from '@/utilities/imageNameGenerator';
import path from 'path';
import { CollectionConfig, ImageUploadFormatOptions } from 'payload';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

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
      required: true,
      admin: {
        description:
          'Alt text is important for accessibility and SEO. Describe the image as specifically and briefly as possible.',
      },
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
  },
  upload: {
    // Uploads to the public/hero directory in Next.js making files publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/hero'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    formatOptions: {
      ...webp,
      options: {
        quality: 100,
        lossless: true,
      },
    },
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
    beforeOperation: [snakeCaseUploadsHook],
    beforeChange: [computeBlurDataHook, populateTitleFromFileHook],
  },
};
