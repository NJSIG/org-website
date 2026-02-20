import {
  BlockquoteFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  LinkFields,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical';
import { TextFieldSingleValidation } from 'payload';
import { FontSizeFeature } from './features/FontSize/feature.server';

export const defaultLexical = lexicalEditor({
  features: [
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
    UnorderedListFeature(),
    OrderedListFeature(),
    BlockquoteFeature(),
    FontSizeFeature(),
    BoldFeature(),
    ItalicFeature(),
    LinkFeature({
      enabledCollections: ['pages', 'events'],
      fields: ({ defaultFields }) => {
        const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
          if ('name' in field && field.name === 'url') return false;
          return true;
        });

        return [
          ...defaultFieldsWithoutUrl,
          {
            name: 'url',
            type: 'text',
            admin: {
              condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
            },
            label: ({ t }) => t('fields:enterURL'),
            required: true,
            validate: ((value, options) => {
              if ((options?.siblingData as LinkFields)?.linkType === 'internal') {
                return true; // No url validation needed for internal links
              }
              return value ? true : 'URL is required';
            }) as TextFieldSingleValidation,
          },
        ];
      },
    }),
    InlineToolbarFeature(),
    FixedToolbarFeature(),
  ],
});
