import { defaultFontSizes } from '@/fields/DefaultLexical/utils/availableFontSizes';
import { SerializedTextNode } from '@payloadcms/richtext-lexical/lexical';
import { JSXConverters } from '@payloadcms/richtext-lexical/react';
import {
  StateValues,
  TextStateFeatureProps,
} from 'node_modules/@payloadcms/richtext-lexical/dist/features/textState/feature.server';
import React from 'react';

const IS_BOLD = 1;
const IS_ITALIC = 2;
const IS_STRIKETHROUGH = 4;
const IS_UNDERLINE = 8;
const IS_CODE = 16;
const IS_SUBSCRIPT = 32;
const IS_SUPERSCRIPT = 64;
const TEXT_STATE: TextStateFeatureProps['state'] = {
  fontSize: { ...defaultFontSizes },
};

type ExtractTextStateKeys<T> = {
  [P in keyof T]: T[P] extends StateValues ? keyof T[P] : never;
}[keyof T];

type TextStateKeys = ExtractTextStateKeys<typeof TEXT_STATE>;

export const textConverter: JSXConverters<SerializedTextNode> = {
  text: ({ node }: { node: SerializedTextNode }) => {
    const styles: React.CSSProperties = {};

    let text: React.ReactNode = node.text;

    // Basic Formatters
    // Strikethrough and Underline could maybe be combined with the text state
    // styles to reduce the number of elements produced
    if (node.format & IS_BOLD) {
      text = <strong>{text}</strong>;
    }

    if (node.format & IS_ITALIC) {
      text = <em>{text}</em>;
    }

    if (node.format & IS_STRIKETHROUGH) {
      text = <span style={{ textDecoration: 'line-through' }}>{text}</span>;
    }

    if (node.format & IS_UNDERLINE) {
      text = <span style={{ textDecoration: 'underline' }}>{text}</span>;
    }

    if (node.format & IS_CODE) {
      text = <code>{text}</code>;
    }

    if (node.format & IS_SUBSCRIPT) {
      text = <sub>{text}</sub>;
    }

    if (node.format & IS_SUPERSCRIPT) {
      text = <sup>{text}</sup>;
    }

    // Text State Formatter
    if (node.$) {
      Object.entries(TEXT_STATE).forEach(([stateKey, stateValues]) => {
        const stateValue = node.$ && (node.$[stateKey] as TextStateKeys);

        if (stateValue && stateValues[stateValue]) {
          Object.assign(styles, stateValues[stateValue].css);
        }
      });

      text = <span style={styles}>{text}</span>;
    }

    return text;
  },
};
