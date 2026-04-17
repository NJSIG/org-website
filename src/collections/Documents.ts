import { anyone, editor } from '@/access';
import { populateFileTypeHook } from '@/collections/hooks/populateFileTypeHook';
import { populatePublishedAtHook } from '@/collections/hooks/populatePublishedAtHook';
import { populateTitleFromFileHook } from '@/collections/hooks/populateTitleFromFileHook';
import { createSnakeCaseUploadsHook } from '@/collections/hooks/snakeCaseUploadsHook';
import { CollectionConfig } from 'payload';

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
      name: 'relatedEvents',
      type: 'join',
      collection: 'events',
      on: 'resources.resource.document',
    },
    // Sidebar Fields
    {
      name: 'fileType',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'lastUpdatedAt',
      type: 'date',
      virtual: 'updatedAt',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  admin: {
    defaultColumns: ['filename', 'title', 'folder'],
    group: 'Media',
  },
  upload: {
    pasteURL: false,
    mimeTypes: supportedMimeTypes,
  },
  hooks: {
    beforeOperation: [createSnakeCaseUploadsHook('documents')],
    beforeChange: [populatePublishedAtHook, populateTitleFromFileHook, populateFileTypeHook],
  },
};
