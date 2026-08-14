'use client';

import type { FetchPage } from '@/components/hooks/usePaginatedData';
import { usePaginatedData } from '@/components/hooks/usePaginatedData';
import { LegalNoticeCard } from '@/components/LegalNoticeCard';
import { Pagination } from '@/components/Pagination';
import { LegalNotice } from '@/payload-types';
import { PaginatedDocs } from 'payload';
import { useRef } from 'react';
import { CollectionListLegalNoticesProps } from './Component';

const EMPTY_NOTICES: PaginatedDocs<LegalNotice> = {
  docs: [],
  totalDocs: 0,
  limit: 10,
  totalPages: 1,
  page: 1,
  pagingCounter: 1,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: null,
  nextPage: null,
};

const PAGE_SIZES = [10, 25, 50];

type CollectionListLegalNoticesClientProps = CollectionListLegalNoticesProps & {
  notices: PaginatedDocs<LegalNotice> | null;
  fetchPage: FetchPage<LegalNotice>;
};

export const CollectionListLegalNoticesClient: React.FC<CollectionListLegalNoticesClientProps> = ({
  filters,
  notices,
  fetchPage,
}) => {
  const blockTopRef = useRef<HTMLDivElement>(null);
  const { data, perPage, isPending, goToPage, changePerPage } = usePaginatedData(
    notices ?? EMPTY_NOTICES,
    fetchPage,
  );

  return data.docs.length > 0 ? (
    <div ref={blockTopRef}>
      {filters?.pagination && (
        <Pagination
          page={data.page || 1}
          perPage={perPage}
          totalPages={data.totalPages}
          totalDocs={data.totalDocs}
          pageSizes={PAGE_SIZES}
          onPageChange={goToPage}
          onPerPageChange={changePerPage}
          isPending={isPending}
          className="mb-4"
        />
      )}
      <div className="space-y-4">
        {data.docs.map((notice) => (
          <LegalNoticeCard key={notice.id} {...notice} />
        ))}
      </div>
      {filters?.pagination && (
        <Pagination
          page={data.page || 1}
          perPage={perPage}
          totalPages={data.totalPages}
          totalDocs={data.totalDocs}
          pageSizes={PAGE_SIZES}
          onPageChange={goToPage}
          onPerPageChange={changePerPage}
          isPending={isPending}
          className="mt-4"
          scrollToTopTargetRef={blockTopRef}
          scrollToTopOffset={48}
        />
      )}
    </div>
  ) : (
    <div className="rounded-3xl bg-njsig-neutral-tint p-4">
      <h3 className="text-xl font-bold">No legal notices found.</h3>
    </div>
  );
};
