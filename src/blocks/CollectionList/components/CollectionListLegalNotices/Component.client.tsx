import { LegalNotice } from '@/payload-types';
import { PaginatedDocs } from 'payload';
import { CollectionListLegalNoticesProps } from './Component';

type CollectionListLegalNoticesClientProps = CollectionListLegalNoticesProps & {
  notices: PaginatedDocs<LegalNotice> | null;
};

export const CollectionListLegalNoticesClient: React.FC<CollectionListLegalNoticesClientProps> = ({
  filters,
  searchParams,
  notices,
}) => {
  return notices && notices.docs.length ? (
    <div className="space-y-4">
      {notices.docs.map((notice) => (
        <div key={notice.id} className="rounded-3xl bg-njsig-neutral-tint p-4">
          <span>Legal Notice Card</span>
        </div>
      ))}
    </div>
  ) : (
    <div className="rounded-3xl bg-njsig-neutral-tint p-4">
      <h3 className="text-xl font-bold">No legal notices found.</h3>
    </div>
  );
};
