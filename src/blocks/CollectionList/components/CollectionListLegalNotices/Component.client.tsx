'use client';

import { LegalNoticeCard } from '@/components/LegalNoticeCard';
import { LegalNotice } from '@/payload-types';
import { PaginatedDocs } from 'payload';
import { CollectionListPageControl } from '../CollectionListPageControl';
import { CollectionListLegalNoticesProps } from './Component';

type CollectionListLegalNoticesClientProps = CollectionListLegalNoticesProps & {
  notices: PaginatedDocs<LegalNotice> | null;
};

export const CollectionListLegalNoticesClient: React.FC<CollectionListLegalNoticesClientProps> = ({
  filters,
  notices,
}) => {
  return notices && notices.docs.length ? (
    <>
      {filters?.pagination && (
        <CollectionListPageControl totalDocs={notices.totalDocs} className="mb-4" />
      )}
      <div className="space-y-4">
        {notices.docs.map((notice) => (
          <LegalNoticeCard key={notice.id} {...notice} />
        ))}
      </div>
      {filters?.pagination && (
        <CollectionListPageControl totalDocs={notices.totalDocs} className="mt-4" />
      )}
    </>
  ) : (
    <div className="rounded-3xl bg-njsig-neutral-tint p-4">
      <h3 className="text-xl font-bold">No legal notices found.</h3>
    </div>
  );
};
