import { textStateConfig } from '@/fields/DefaultLexical/textStateConfig';
import type { DefaultNodeTypes, SerializedTextNode } from '@payloadcms/richtext-lexical';
import { JSXConverterArgs, JSXConverters } from '@payloadcms/richtext-lexical/react';

// Lexical serializes node state under the "$" key.
const NODE_STATE_KEY = '$';

// React's style prop requires camelCase, but TextStateFeature CSS uses kebab-case.
const kebabToCamel = (str: string): string => {
  return str.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
};

export const CustomTextConverter = (
  defaultConverters: JSXConverters<DefaultNodeTypes>,
  args: JSXConverterArgs<SerializedTextNode>,
) => {
  const { node } = args;

  // Render standard formatting (bold, italic, etc.) using the default converter.
  let text =
    typeof defaultConverters.text === 'function' ? defaultConverters.text(args) : node.text;

  // Apply TextStateFeature styles from the "$" key in the serialized node.
  const nodeState = (node as any)[NODE_STATE_KEY] as Record<string, string> | undefined;

  if (nodeState) {
    const styles: React.CSSProperties = {};

    for (const [stateKey, stateValue] of Object.entries(nodeState)) {
      const css = (textStateConfig as any)[stateKey]?.[stateValue]?.css;

      if (css) {
        for (const [prop, value] of Object.entries(css)) {
          (styles as any)[kebabToCamel(prop)] = value;
        }
      }
    }

    if (Object.keys(styles).length > 0) {
      text = <span style={styles}>{text}</span>;
    }
  }

  return text;
};
