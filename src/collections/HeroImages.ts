import { admin, anyone } from '@/access';
import { computeBlurhashHook, snakeCaseUploadsHook } from '@/hooks';
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
      type: 'text',
      required: true,
    },
    {
      name: 'blurhash',
      type: 'text',
      admin: {
        readOnly: true,
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
    adminThumbnail: 'small',
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'small',
        width: 640,
        height: 360,
        formatOptions: {
          ...webp,
          options: {
            quality: 75,
          },
        },
      },
      {
        name: 'medium',
        width: 1280,
        height: 720,
        formatOptions: webp,
      },
      {
        name: 'large',
        width: 2400,
        height: 1350,
        formatOptions: webp,
      },
    ],
  },
  hooks: {
    beforeOperation: [snakeCaseUploadsHook],
    beforeChange: [computeBlurhashHook],
  },
};
