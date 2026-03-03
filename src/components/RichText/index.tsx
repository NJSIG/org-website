import { cn } from '@/utilities/cn';
import { type DefaultNodeTypes, type DefaultTypedEditorState } from '@payloadcms/richtext-lexical';
import {
  RichText as ConvertRichText,
  JSXConvertersFunction,
  LinkJSXConverter,
} from '@payloadcms/richtext-lexical/react';
import { internalLinkConverter } from './converters/internalLinkConverter';
import { textConverter } from './converters/textConverter';

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
  ...LinkJSXConverter({ internalDocToHref: internalLinkConverter }), // TODO: Test link converter
  ...textConverter,
  // Add Blocks here
  blocks: {},
  inlineBlocks: {},
});

export const RichText = (props: RichTextProps) => {
  const { data, className, enableProse = true, enableGutter = true, ...rest } = props;

  return (
    <ConvertRichText
      data={data}
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'prose prose-battleship prose-lg dark:prose-invert': enableProse,
        },
        className,
      )}
      {...rest}
    />
  );
};
