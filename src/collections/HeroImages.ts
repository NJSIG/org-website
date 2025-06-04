import { admin, anyone } from '@/access';
import { computeBlurDataHook, snakeCaseUploadsHook } from '@/hooks';
import { imageNameGenerators } from '@/utilities/imageNameGenerator';
import path from 'path';
import { CollectionConfig, ImageUploadFormatOptions } from 'payload';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const webp: ImageUploadFormatOptions = {
  format: 'webp',
  options: {
    quality: 80,
  },
};

export const HeroImages: CollectionConfig = {
  slug: 'hero-images',
  access: {
    create: admin,
    delete: admin,
    read: anyone,
    update: admin,
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt Text',
      type: 'text',
      required: true,
    },
    {
      name: 'blurhash',
      label: 'Blurhash',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Used for image placeholders. Automatically generated from the image.',
      },
    },
  ],
  admin: {
    defaultColumns: ['filename', 'alt'],
  },
  upload: {
    // Uploads to the public/hero-images directory in Next.js making files publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/hero-images'),
    focalPoint: true,
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 320,
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
            quality: 75,
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
    beforeChange: [computeBlurDataHook],
  },
};
