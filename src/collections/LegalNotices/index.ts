import { editor, editorOrPublished } from '@/access';
import { resourceGroupField } from '@/fields/ResourceGroup';
import { CollectionConfig, TextFieldSingleValidation } from 'payload';
import { populatePublishedAtHook } from '../hooks/populatePublishedAtHook';
import { LegalNoticeTypes } from './types';

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
      options: Object.values(LegalNoticeTypes),
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
        description:
          'This title is only used for the admin panel and will not be displayed to the public.',
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
            date: {
              pickerAppearance: 'dayAndTime',
            },
            description:
              'The date the legal notice is posted. Future dates will not be visible to the public until the posting date is reached.',
          },
        },
        {
          name: 'closeDate',
          type: 'date',
          admin: {
            description: 'RFPs will be marked as closed on this date.',
            condition: (_, siblingData) => siblingData?.noticeType === LegalNoticeTypes.RFP.value,
          },
          hooks: {
            beforeChange: [
              ({ value, siblingData }) =>
                siblingData?.noticeType !== LegalNoticeTypes.RFP.value && value ? null : value,
            ],
          },
        },
      ],
    },
    {
      name: 'rfpTracking',
      label: 'RFP Tracking Number(s)',
      type: 'text',
      validate: ((value: string, { siblingData }) => {
        const noticeType = (siblingData as { noticeType?: string })?.noticeType;

        if (
          noticeType === LegalNoticeTypes.RFP.value ||
          noticeType === LegalNoticeTypes.RFPAward.value
        ) {
          if (!value || value.trim() === '') {
            return 'RFP Tracking Number(s) is required for RFPs and RFP Awards.';
          }
        }

        return true;
      }) as TextFieldSingleValidation,
      admin: {
        description:
          'Tracking ID for RFPs. e.g. "NJSIG-2024-001" or "NJSIG-2024-001, NJSIG-2024-002"',
        condition: (_, siblingData) =>
          siblingData?.noticeType === LegalNoticeTypes.RFP.value ||
          siblingData?.noticeType === LegalNoticeTypes.RFPAward.value,
      },
      hooks: {
        beforeChange: [
          ({ value, siblingData }) =>
            siblingData?.noticeType !== LegalNoticeTypes.RFP.value &&
            siblingData?.noticeType !== LegalNoticeTypes.RFPAward.value &&
            value
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
