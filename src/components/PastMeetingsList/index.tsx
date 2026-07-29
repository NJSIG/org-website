import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Pagination } from '../Pagination';
import { MeetingLink } from './components/MeetingLink';
import { PastMeetingsListProps } from './types';

export const PastMeetingsList: React.FC<PastMeetingsListProps> = ({ meetings, className }) => {
  const blockTopRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const currentPageParam = searchParams?.get('page');
    const currentPerPageParam = searchParams?.get('perPage');
    const hasPaginationParams = currentPageParam !== null || currentPerPageParam !== null;
    const hasNoResults = meetings?.docs.length === 0;

    if (!hasPaginationParams || !hasNoResults) {
      return;
    }

    router.replace(`${pathname}`);
  }, [meetings?.docs.length, pathname, router, searchParams]);

  return (
    <div className={className} ref={blockTopRef}>
      <div className="flex flex-col gap-4">
        {meetings.docs.map((meeting) => (
          <MeetingLink key={meeting.id} meeting={meeting} />
        ))}
      </div>
      <Pagination
        totalDocs={meetings.totalDocs}
        pageSizes={[5]}
        defaultPageSize={5}
        className="mt-4"
        scrollToTopTargetRef={blockTopRef}
        scrollToTopOffset={94}
      />
    </div>
  );
};
