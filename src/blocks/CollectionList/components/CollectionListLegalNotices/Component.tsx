import { CollectionListBlock } from '@/payload-types';
import { CollectionListLegalNoticesClient } from './Component.client';
import { queryLegalNotices } from './action';

export type CollectionListLegalNoticesProps = {
  filters: CollectionListBlock['legalNoticeFilters'];
};

export const CollectionListLegalNotices: React.FC<CollectionListLegalNoticesProps> = async ({
  filters,
}) => {
  const notices = await queryLegalNotices({ filters });

  async function fetchPage({ page, perPage }: { page: number; perPage: number }) {
    'use server';

    return queryLegalNotices({ filters, page, perPage });
  }

  return (
    <CollectionListLegalNoticesClient filters={filters} notices={notices} fetchPage={fetchPage} />
  );
};
