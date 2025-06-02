import { admin, anyone } from '@/access';
import { computeBlurhashHook, snakeCaseUploadsHook } from '@/hooks';
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';
import path from 'path';
import type { CollectionConfig, ImageUploadFormatOptions } from 'payload';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const webp: ImageUploadFormatOptions = {
  format: 'webp',
  options: {
    quality: 80,
  },
};

const png: ImageUploadFormatOptions = {
  format: 'png',
};

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: admin,
    delete: admin,
    read: anyone,
    update: admin,
  },
  folders: true,
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()];
        },
      }),
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
    defaultColumns: ['filename', 'alt', 'caption', 'folder'],
  },
  upload: {
    // Uploads to the public/media directory in Next.js making files publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        formatOptions: webp,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
        formatOptions: webp,
      },
      {
        name: 'small',
        width: 600,
        formatOptions: webp,
      },
      {
        name: 'medium',
        width: 900,
        formatOptions: webp,
      },
      {
        name: 'large',
        width: 1400,
        formatOptions: webp,
      },
      {
        name: 'xlarge',
        width: 1920,
        formatOptions: webp,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
        formatOptions: png,
      },
    ],
  },
  hooks: {
    beforeOperation: [snakeCaseUploadsHook],
    beforeChange: [computeBlurhashHook],
  },
};
