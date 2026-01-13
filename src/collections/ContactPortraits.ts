import { anyone, editor } from '@/access';
import { uiTipField } from '@/fields/uiTip';
import { checkSquareHook } from '@/hooks/checkSquareHook';
import { computeBlurDataHook } from '@/hooks/computeBlurDataHook';
import { createSnakeCaseUploadsHook } from '@/hooks/snakeCaseUploadsHook';
import { CollectionConfig, ImageUploadFormatOptions } from 'payload';

const webp: ImageUploadFormatOptions = {
  format: 'webp',
  options: {
    quality: 90,
  },
};

export const ContactPortraits: CollectionConfig<'contact-portraits'> = {
  slug: 'contact-portraits',
  access: {
    create: editor,
    delete: editor,
    read: anyone,
    update: editor,
  },
  trash: true,
  disableDuplicate: true,
  fields: [
    uiTipField(['Portrait photos should be square and at least 250x250 pixels for best results.']),
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'The name of the person in the portrait photo.',
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
  folders: true,
  admin: {
    defaultColumns: ['filename', 'name', 'folder'],
    useAsTitle: 'name',
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
    adminThumbnail: 'original',
    mimeTypes: ['image/*'],
    focalPoint: true,
    formatOptions: {
      ...webp,
      options: {
        quality: 100,
        lossless: true,
      },
    },
  },
  hooks: {
    beforeOperation: [createSnakeCaseUploadsHook('contact-portraits')],
    beforeChange: [checkSquareHook, computeBlurDataHook],
  },
};
