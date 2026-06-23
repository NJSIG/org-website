import { cn } from '@/utilities/cn';
import { type DefaultNodeTypes, type DefaultTypedEditorState } from '@payloadcms/richtext-lexical';
import {
  RichText as ConvertRichText,
  JSXConvertersFunction,
  LinkJSXConverter,
} from '@payloadcms/richtext-lexical/react';
import { CustomTextConverter } from './converters/customTextConverter';
import { internalLinkConverter } from './converters/internalLinkConverter';

type RichTextProps = {
  data: DefaultTypedEditorState;
  enableProse?: boolean;
  enableGutter?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Add Blocks or Inline Blocks to NodeTypes as needed
 * Union SerializedBlockNode or SerializedInlineBlockNode to the NodeTypes as needed
 * Union all appropriate blocks in the block node types i.e. SerializedBlockNode<BlockOne | BlockTwo>
 */
type NodeTypes = DefaultNodeTypes;

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  // Add custom converters here
  ...LinkJSXConverter({ internalDocToHref: internalLinkConverter }),
  text: (args) => CustomTextConverter(defaultConverters, args),
  // Add Blocks here
  blocks: {},
  inlineBlocks: {},
});

export const RichText = (props: RichTextProps) => {
  const { data, className, enableProse = true, enableGutter = true, ...rest } = props;
  const hasExplicitProseSize = /\bprose-(sm|base|lg|xl|2xl)\b/.test(className ?? '');

  return (
    <ConvertRichText
      data={data}
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'prose prose-battleship dark:prose-invert': enableProse,
          'prose-lg': enableProse && !hasExplicitProseSize,
        },
        className,
      )}
      {...rest}
    />
  );
};
