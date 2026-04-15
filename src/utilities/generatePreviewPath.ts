import { CollectionSlug, PayloadRequest } from 'payload';

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  pages: '',
  subfunds: 'sub-funds',
};

type Props = {
  collection: keyof typeof collectionPrefixMap;
  slug: string;
  path?: string;
  req: PayloadRequest;
};

export const generatePreviewPath = ({ collection, slug, path }: Props) => {
  const resolvedPath = path || `${collectionPrefixMap[collection]}/${slug}`;

  const encodedParams = new URLSearchParams({
    slug,
    collection,
    path: resolvedPath,
    previewSecret: process.env.PREVIEW_SECRET || '',
  });

  const url = `/next/preview?${encodedParams.toString()}`;

  return url;
};
