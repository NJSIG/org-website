import { anyone, editor } from '@/access';
import { computeBlurDataHook, snakeCaseUploadsHook } from '@/hooks';
import { imageNameGenerators } from '@/utilities/imageNameGenerator';
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
    quality: 90,
  },
};

const png: ImageUploadFormatOptions = {
  format: 'png',
};

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: editor,
    delete: editor,
    read: anyone,
    update: editor,
  },
  folders: true,
  fields: [
    {
      name: 'alt',
      label: 'Alt Text',
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
      admin: {
        description: 'Captions may or may not be displayed depending on where an image is used.',
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
    defaultColumns: ['filename', 'alt', 'caption', 'folder'],
  },
  upload: {
    // Uploads to the public/media directory in Next.js making files publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/media'),
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
        name: 'square',
        width: 500,
        height: 500,
        formatOptions: webp,
        generateImageName: imageNameGenerators.byWidth,
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
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
        formatOptions: png,
        generateImageName: imageNameGenerators.bySize,
      },
    ],
  },
  hooks: {
    beforeOperation: [snakeCaseUploadsHook],
    beforeChange: [computeBlurDataHook],
  },
};
