import {
  BlockquoteFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical';
import { Block } from 'payload';

export const SectionContent: Block = {
  slug: 'sectionContent',
  interfaceName: 'SectionContentBlock',
  imageURL: '/blocks/section/section-content.png',
  imageAltText: 'Section Content Block',
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'Formatting options are limited to maintain consistency across the site.',
      },
      editor: lexicalEditor({
        features: () => [
          BoldFeature(),
          ItalicFeature(),
          ParagraphFeature(),
          HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
          UnorderedListFeature(),
          OrderedListFeature(),
          LinkFeature(), // TODO: Customize link fields
          BlockquoteFeature(),
          InlineToolbarFeature(),
          FixedToolbarFeature(),
        ],
      }),
    },
  ],
};
