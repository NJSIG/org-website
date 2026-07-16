import { anyone, editor } from '@/access';
import { computeBlurDataHook } from '@/collections/hooks/computeBlurDataHook';
import { populateTitleFromFileHook } from '@/collections/hooks/populateTitleFromFileHook';
import { createSnakeCaseUploadsHook } from '@/collections/hooks/snakeCaseUploadsHook';
import { documentConsumerTrackingField } from '@/fields/DocumentConsumerTracking';
import { imageNameGenerators } from '@/utilities/imageNameGenerator';
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';
import type { CollectionConfig, ImageUploadFormatOptions } from 'payload';
import { preventDeleteWhenConsumedHook } from './hooks/preventDeleteWhenConsumedHook';
import { preventSoftDeleteWhenConsumedHook } from './hooks/preventSoftDeleteWhenConsumedHook';

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
  trash: true,
  disableDuplicate: true,
  fields: [
    {
      name: 'title',
      label: 'Title',
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
      localized: true,
      admin: {
        description:
          'Alt text is important for accessibility and SEO. Describe the image as specifically and briefly as possible.',
      },
    },
    {
      name: 'caption',
      type: 'richText',
      localized: true,
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
    // Usage Tracking
    documentConsumerTrackingField(),
  ],
  admin: {
    defaultColumns: ['filename', 'title', 'alt', 'folder'],
    group: 'Media',
  },
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
    mimeTypes: ['image/*', 'video/*', 'audio/*'],
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
    beforeOperation: [createSnakeCaseUploadsHook('media')],
    beforeChange: [
      computeBlurDataHook,
      populateTitleFromFileHook,
      preventSoftDeleteWhenConsumedHook,
    ],
    beforeDelete: [preventDeleteWhenConsumedHook],
  },
};
