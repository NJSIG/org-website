import { anyone, editor } from '@/access';
import { computeBlurDataHook, snakeCaseUploadsHook } from '@/hooks';
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

export const ContactPortraits: CollectionConfig<'contact-portraits'> = {
  slug: 'contact-portraits',
  access: {
    create: editor,
    delete: editor,
    read: anyone,
    update: editor,
  },
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
  },
  upload: {
    // Uploads to the public/contacts directory in Next.js making files
    // publicly accessible outside of Payload.
    staticDir: path.resolve(dirname, '../../public/contacts'),
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
    beforeChange: [computeBlurDataHook],
  },
};
