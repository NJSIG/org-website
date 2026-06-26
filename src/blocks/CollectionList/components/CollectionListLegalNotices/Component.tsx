import { CollectionListBlock } from '@/payload-types';
import { CollectionListLegalNoticesClient } from './Component.client';
import { queryLegalNotices } from './action';

export type CollectionListLegalNoticesProps = {
  filters: CollectionListBlock['legalNoticeFilters'];
  searchParams?: Record<string, string | string[] | undefined>;
};

export const CollectionListLegalNotices: React.FC<CollectionListLegalNoticesProps> = async ({
  filters,
  searchParams,
}) => {
  const notices = await queryLegalNotices({ filters, searchParams });

  return (
    <CollectionListLegalNoticesClient
      filters={filters}
      searchParams={searchParams}
      notices={notices}
    />
  );
};
