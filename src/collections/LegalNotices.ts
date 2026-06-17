import { editor, editorOrPublished } from '@/access';
import { resourceGroupField } from '@/fields/ResourceGroup';
import { CollectionConfig } from 'payload';
import { populatePublishedAtHook } from './hooks/populatePublishedAtHook';

export const LegalNotices: CollectionConfig<'legal-notices'> = {
  slug: 'legal-notices',
  access: {
    create: editor,
    delete: editor,
    read: editorOrPublished,
    update: editor,
  },
  defaultPopulate: {
    noticeType: true,
    title: true,
    content: true,
    postingDate: true,
    closeDate: true,
    important: true,
  },
  fields: [
    {
      name: 'noticeType',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Legal Notice', value: 'legalNotice' },
        { label: 'RFP', value: 'rfp' },
        { label: 'RFP Award', value: 'rfpAward' },
      ],
      admin: {
        isClearable: false,
        description: 'The type of legal notice will determine how it is displayed.',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The title of the legal notice.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'Formatting options are limited to maintain consistency across the site.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'postingDate',
          type: 'date',
          required: true,
          index: true,
          admin: {
            description:
              'The date the legal notice is posted. Future dates will not be visible to the public until the posting date is reached.',
          },
        },
        {
          name: 'closeDate',
          type: 'date',
          admin: {
            description: 'RFPs will be marked as closed on this date.',
            condition: ({ siblingData }) => siblingData?.noticeType === 'rfp',
          },
          hooks: {
            beforeChange: [
              ({ value, siblingData }) =>
                siblingData?.noticeType !== 'rfp' && value ? null : value,
            ],
          },
        },
      ],
    },
    {
      name: 'rfpTracking',
      type: 'text',
      index: true,
      admin: {
        description: 'Tracking ID for RFPs. e.g. "NJSIG-2024-001"',
        condition: ({ siblingData }) =>
          siblingData?.noticeType === 'rfp' || siblingData?.noticeType === 'rfpAward',
      },
      hooks: {
        beforeChange: [
          ({ value, siblingData }) =>
            siblingData?.noticeType !== 'rfp' && siblingData?.noticeType !== 'rfpAward' && value
              ? null
              : value,
        ],
      },
    },
    resourceGroupField({
      resourceTypes: ['document'],
      overrides: {
        group: {
          admin: {
            description:
              'Attach files related to this legal notice, such as RFP documents or award details.',
          },
        },
        row: {
          label: '', // Hide the row label
        },
      },
    }),
    // Sidebar Fields
    {
      name: 'important',
      type: 'checkbox',
      admin: {
        description: 'Mark this legal notice as important to emphasize its significance.',
        position: 'sidebar',
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
  defaultSort: '-postingDate',
  hooks: {
    beforeChange: [populatePublishedAtHook],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 10,
  },
  admin: {
    defaultColumns: ['title', 'noticeType', 'postingDate', 'closeDate', 'important'],
    useAsTitle: 'title',
  },
};
