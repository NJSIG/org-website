import { editor, editorOrPublished } from '@/access';
import { populatePublishedAtHook } from '@/collections/hooks/populatePublishedAtHook';
import { revalidatePageDeleteHook, revalidatePageHook } from '@/collections/Pages/hooks';
import { dynamicBlocksField, templateOptions } from '@/fields/DynamicBlocks';
import { slugField } from '@/fields/Slug';
import { Page } from '@/payload-types';
import { generatePreviewPath } from '@/utilities/generatePreviewPath';
import { getPagePath } from '@/utilities/getPagePath';
import { createBreadcrumbsField, createParentField } from '@payloadcms/plugin-nested-docs';
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields';
import type { CollectionConfig } from 'payload';

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: editor,
    delete: editor,
    read: editorOrPublished,
    update: editor,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
    breadcrumbs: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'The title of the page, used for routing, SEO, tabs, and the admin UI.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'layout',
          label: 'CONTENT',
          fields: [...dynamicBlocksField({ localized: true })],
        },
        {
          name: 'meta',
          label: 'SEO',
          admin: {
            condition: (_, siblingData) => siblingData.layout?.template !== 'navOnly',
          },
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
            }),
            MetaDescriptionField({}),
            PreviewField({
              // If the `generateUrl` function is configured
              hasGenerateFn: true,
              // Fields paths to mach the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    // Sidebar Fields
    createParentField('pages', {
      filterOptions: ({ id }) => ({
        id: { not_equals: id }, // Prevent self reference
        slug: { not_equals: 'home' }, // Prevent referencing the home page
        'layout.template': { not_equals: 'navOnly' }, // Prevent referencing navOnly pages
      }),
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => siblingData.layout?.template !== 'navOnly',
      },
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) => {
            if (siblingData?.layout?.template === 'navOnly') {
              return null;
            }

            return value;
          },
        ],
      },
    }),
    ...slugField(),
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
    // Breadcrumbs Field
    // This must be at the top level per the Nested Docs plugin requirements, but we can conditionally hide it in the UI since it's not relevant for all page types
    createBreadcrumbsField('pages', {
      admin: {
        description: 'Breadcrumbs are generated based on the page hierarchy.',
        condition: (_, siblingData) => siblingData.layout?.template !== 'navOnly',
      },
    }),
    // Hidden Fields
    {
      name: 'template',
      type: 'text',
      virtual: true,
      admin: {
        hidden: true,
      },
      hooks: {
        afterRead: [
          ({ data }) => {
            const template =
              templateOptions[data?.layout?.template as keyof typeof templateOptions];

            return template?.label || null;
          },
        ],
      },
    },
  ],
  defaultSort: 'title',
  hooks: {
    beforeChange: [populatePublishedAtHook],
    afterChange: [revalidatePageHook],
    afterDelete: [revalidatePageDeleteHook],
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
  folders: true,
  trash: true,
  admin: {
    defaultColumns: ['title', 'slug', 'template', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const pagePath = getPagePath(data as Partial<Page>) || '/';

        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'pages',
          path: pagePath,
          req,
        });

        return path;
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
        path: getPagePath(data as Partial<Page>) || '/',
        req,
      }),
    useAsTitle: 'title',
  },
};
