import { cache } from 'react';
import { CollectionListLegalNoticesProps } from './Component';

export const queryLegalNotices = cache(
  async ({ filters, searchParams }: CollectionListLegalNoticesProps) => {
    return null;
  },
);
