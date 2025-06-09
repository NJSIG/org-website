import { admin, adminOrPublished } from '@/access';
import { revalidateDeleteHook, revalidatePageHook } from '@/collections/Pages/hooks';
import { dynamicBlocksField } from '@/fields/dynamicBlocks';
import { slugField } from '@/fields/slug';
import { populatePublishedAtHook } from '@/hooks';
import { generatePreviewPath } from '@/utilities/generatePreviewPath';
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
    create: admin,
    delete: admin,
    read: adminOrPublished,
    update: admin,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
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
          fields: [...dynamicBlocksField()],
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
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
  hooks: {
    beforeChange: [populatePublishedAtHook],
    afterChange: [revalidatePageHook],
    afterDelete: [revalidateDeleteHook],
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
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'pages',
          req,
        });

        return path;
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
};
