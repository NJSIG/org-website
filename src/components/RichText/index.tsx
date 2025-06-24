import { cn } from '@/utilities/cn';
import {
  DefaultNodeTypes,
  DefaultTypedEditorState,
  SerializedLinkNode,
} from '@payloadcms/richtext-lexical';
import {
  RichText as ConvertRichText,
  JSXConvertersFunction,
  LinkJSXConverter,
} from '@payloadcms/richtext-lexical/react';

type NodeTypes = DefaultNodeTypes; // TODO: Add any allowed blocks to this type

/**
 * Converts an internal document link node to a URL href.
 *
 * @returns The URL href for the link node.
 */
const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!;

  if (typeof value !== 'object') {
    throw new Error('LinkNode expected value to be an object');
  }

  const slug = value.slug;

  return relationTo === 'pages' ? `/${slug}` : `/${relationTo}/${slug}`;
};

/**
 * JSX converters for the rich text editor.
 */
const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  blocks: {}, // TODO: Add blocks here
});

type RichTextProps = {
  data: DefaultTypedEditorState;
  enableProse?: boolean;
  enableGutter?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function RichText(props: RichTextProps) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props;

  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'prose prose-lg dark:prose-invert mx-auto': enableProse,
        },
        className,
      )}
      {...rest}
    />
  );
}
