import { anyone, editor } from '@/access';
import { populatePublishedAtHook, snakeCaseUploadsHook } from '@/hooks';
import { populateFileTypeHook } from '@/hooks/populateFileTypeHook';
import { populateTitleFromFileHook } from '@/hooks/populateTitleFromFileHook';
import path from 'path';
import { CollectionConfig } from 'payload';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const supportedMimeTypes = [
  'application/pdf', // .pdf
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.ms-excel', // .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-powerpoint', // .ppt
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
];

export const Documents: CollectionConfig = {
  slug: 'documents',
  access: {
    create: editor,
    delete: editor,
    read: anyone,
    update: editor,
  },
  folders: true,
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
      name: 'relatedEvents',
      type: 'join',
      collection: 'events',
      on: 'resources.resource.document',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'fileType',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  admin: {
    defaultColumns: ['filename', 'title', 'folder'],
  },
  upload: {
    // Uploads to the public/documents directory in Next.js making files publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/documents'),
    mimeTypes: supportedMimeTypes,
  },
  hooks: {
    beforeOperation: [snakeCaseUploadsHook],
    beforeChange: [populatePublishedAtHook, populateTitleFromFileHook, populateFileTypeHook],
  },
};
