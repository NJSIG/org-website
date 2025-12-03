import { anyone, editor } from '@/access';
import { checkSquareHook, computeBlurDataHook, snakeCaseUploadsHook } from '@/hooks';
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
  fields: [
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
    skipSafeFetch: process.env.SAFE_FETCH_ALLOWLIST
      ? JSON.parse(process.env.SAFE_FETCH_ALLOWLIST)
      : false,
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
    beforeOperation: [snakeCaseUploadsHook],
    beforeChange: [checkSquareHook, computeBlurDataHook],
  },
};
