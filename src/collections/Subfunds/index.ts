import { editor, editorOrPublished } from '@/access';
import { createUpdateConsumedDocumentHook } from '@/fields/hooks/createUpdateConsumedDocumentHook';
import { resourceGroupField } from '@/fields/ResourceGroup';
import { slugField } from '@/fields/Slug';
import { generatePreviewPath } from '@/utilities/generatePreviewPath';
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields';
import { hasText } from '@payloadcms/richtext-lexical/shared';
import { CollectionConfig } from 'payload';
import { ContactTypeValues } from '../Contacts';
import { revalidateSubfundDeleteHook, revalidateSubfundHook } from './hooks';
import { SubfundThemeOptions } from './types';

export const subfundThemeOptions: SubfundThemeOptions = {
  bacceic: { label: 'BACCEIC', value: 'bacceic' },
  caip: { label: 'CAIP', value: 'caip' },
  ericnorth: { label: 'ERIC North', value: 'ericnorth' },
  ericsouth: { label: 'ERIC South', value: 'ericsouth' },
  ericwest: { label: 'ERIC West', value: 'ericwest' },
  mocssif: { label: 'MOCSSIF', value: 'mocssif' },
  njeif: { label: 'NJEIF', value: 'njeif' },
};

export const Subfunds: CollectionConfig<'subfunds'> = {
  slug: 'subfunds',
  labels: {
    singular: 'Sub-fund',
    plural: 'Sub-funds',
  },
  access: {
    create: editor,
    delete: editor,
    read: editorOrPublished,
    update: editor,
  },
  defaultPopulate: {
    slug: true,
    theme: true,
    shortName: true,
    content: {
      summary: true,
      administrators: true,
      reps: true,
    },
  },
  fields: [
    {
      name: 'theme',
      type: 'select',
      required: true,
      options: Object.values(subfundThemeOptions),
      admin: {
        isClearable: false,
        description: 'The theme applies a color scheme to all themeable elements on the page.',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'The full name of the sub-fund, used for SEO.',
      },
    },
    {
      name: 'shortName',
      type: 'text',
      required: true,
      admin: {
        description: 'The short name of the sub-fund, used for routing, display, and the admin UI.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'content',
          label: 'CONTENT',
          fields: [
            {
              name: 'summary',
              label: 'Sub-fund Summary',
              type: 'richText',
              localized: true,
              required: true,
              admin: {
                description:
                  'A summary of the sub-fund, used for SEO and display. The summary should include the full name, counties, year founded, and administrator.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'administrators',
                  label: 'Sub-fund Administrators',
                  type: 'relationship',
                  relationTo: 'contacts',
                  filterOptions: () => ({
                    type: { equals: ContactTypeValues.Broker },
                  }),
                  required: true,
                  hasMany: true,
                },
                {
                  name: 'reps',
                  label: 'NJSIG Representatives',
                  type: 'relationship',
                  relationTo: 'contacts',
                  filterOptions: () => ({
                    type: { equals: ContactTypeValues.NJSIG },
                  }),
                  required: true,
                  hasMany: true,
                },
              ],
            },
            {
              name: 'eventFilters',
              type: 'relationship',
              relationTo: 'event-categories',
              required: true,
              hasMany: true,
              admin: {
                description:
                  'Select event categories to filter events related to this sub-fund. If no categories are selected, all events will be shown.',
              },
            },
            {
              name: 'pastMeetingsFilters',
              type: 'relationship',
              relationTo: 'event-categories',
              required: true,
              hasMany: true,
              admin: {
                description:
                  'Select event categories to filter past meetings related to this sub-fund. If no categories are selected, the past meetings section will be hidden.',
              },
            },
            resourceGroupField({
              useAsTitle: 'shortName',
              overrides: {
                row: {
                  label: '', // Hide the row label
                },
              },
            }),
            {
              name: 'additionalOfferings',
              type: 'array',
              maxRows: 10,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                  required: true,
                },
                {
                  name: 'subtitle',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'content',
                  type: 'richText',
                  localized: true,
                  validate: (
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    value: any,
                    { siblingData }: { siblingData: { resources?: unknown[] } },
                  ) => {
                    const hasResources = (siblingData?.resources?.length ?? 0) > 0;
                    const hasContent = hasText(value);

                    if (hasResources || hasContent) {
                      return true;
                    }

                    return 'Please provide content or at least one attachment.';
                  },
                },
                resourceGroupField({
                  useAsTitle: 'shortName',
                  overrides: {
                    group: {
                      label: 'Attachments',
                    },
                  },
                }),
              ],
              admin: {
                initCollapsed: true,
                description: 'Add up to 10 additional offerings for this sub-fund.',
                components: {
                  RowLabel: '@/collections/Subfunds/admin/AdditionalOfferingsRowLabel',
                },
              },
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
              overrides: {
                hooks: {
                  afterChange: [createUpdateConsumedDocumentHook('title')],
                },
              },
            }),
            MetaDescriptionField({}),
            PreviewField({
              // If the `generateUrl` function is configured
              hasGenerateFn: true,
              // Fields paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    ...slugField('shortName'),
  ],
  hooks: {
    afterChange: [revalidateSubfundHook],
    afterDelete: [revalidateSubfundDeleteHook],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  admin: {
    defaultColumns: ['shortName', 'theme', 'administrators', 'reps'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'subfunds',
          req,
        });

        return path;
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'subfunds',
        req,
      }),
    useAsTitle: 'shortName',
  },
};
