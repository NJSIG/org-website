'use client';

import { LegalNoticeCard } from '@/components/LegalNoticeCard';
import { LegalNotice } from '@/payload-types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PaginatedDocs } from 'payload';
import { useEffect, useRef } from 'react';
import { CollectionListPageControl } from '../CollectionListPageControl';
import { CollectionListLegalNoticesProps } from './Component';

type CollectionListLegalNoticesClientProps = CollectionListLegalNoticesProps & {
  notices: PaginatedDocs<LegalNotice> | null;
};

export const CollectionListLegalNoticesClient: React.FC<CollectionListLegalNoticesClientProps> = ({
  filters,
  notices,
}) => {
  const blockTopRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const currentPageParam = searchParams?.get('page');
    const currentPerPageParam = searchParams?.get('perPage');
    const hasPaginationParams = currentPageParam !== null || currentPerPageParam !== null;
    const hasNoResults = notices?.docs.length === 0;

    if (!hasPaginationParams || !hasNoResults) {
      return;
    }

    router.replace(`${pathname}`);
  }, [notices?.docs.length, pathname, router, searchParams]);

  return notices && notices.docs.length ? (
    <div ref={blockTopRef}>
      {filters?.pagination && (
        <CollectionListPageControl totalDocs={notices.totalDocs} className="mb-4" />
      )}
      <div className="space-y-4">
        {notices.docs.map((notice) => (
          <LegalNoticeCard key={notice.id} {...notice} />
        ))}
      </div>
      {filters?.pagination && (
        <CollectionListPageControl
          totalDocs={notices.totalDocs}
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
