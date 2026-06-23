import { uiTipField } from '@/fields/UITip';
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
  LinkFeature,
  ParagraphFeature,
} from '@payloadcms/richtext-lexical';
import { Block } from 'payload';

export const PageTitle: Block = {
  slug: 'pageTitle',
  interfaceName: 'PageTitleBlock',
  admin: {
    group: 'Titles & Headings',
    images: {
      thumbnail: {
        url: '/blocks/page-title/thumb.png',
        alt: 'Page Title',
      },
      icon: {
        url: '/blocks/page-title/icon.svg',
        alt: 'Page Title',
      },
    },
  },
  fields: [
    uiTipField([
      'Page Title is a basic heading block. For more complex display headings, consider using the Banner Title block.',
    ]),
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'subtitle',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: [
          ParagraphFeature(),
          LinkFeature({
            enabledCollections: ['pages'],
            fields: ({ defaultFields }) => {
              const defaultFieldsWithoutExternal = defaultFields.filter((field) => {
                if ('name' in field && field.name === 'url') return false;
                if ('name' in field && field.name === 'linkType') return false;

                return true;
              });

              return [...defaultFieldsWithoutExternal];
            },
          }),
          InlineToolbarFeature(),
          FixedToolbarFeature(),
        ],
      }),
      admin: {
        description: 'The subtitle is displayed below the main title in a smaller font size.',
      },
    },
  ],
};
