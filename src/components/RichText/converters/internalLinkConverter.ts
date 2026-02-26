import type { SerializedLinkNode } from '@payloadcms/richtext-lexical';

/**
 * Converts an internal document link node to a URL href.
 *
 * @returns The URL href for the link node.
 */
export const internalLinkConverter = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!;

  if (typeof value !== 'object') {
    throw new Error('LinkNode expected value to be an object');
  }

  const slug = value.slug;

  switch (relationTo) {
    case 'pages':
      return `/${slug}`;
    case 'posts':
      return `/blog/${slug}`;
    default:
      return `/${relationTo}/${slug}`;
  }
};
