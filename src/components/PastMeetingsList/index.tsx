import { useRef } from 'react';
import { usePaginatedData } from '../hooks/usePaginatedData';
import { Pagination } from '../Pagination';
import { MeetingLink } from './components/MeetingLink';
import { PastMeetingsListProps } from './types';

export const PastMeetingsList: React.FC<PastMeetingsListProps> = ({
  meetings,
  fetchPage,
  className,
}) => {
  const blockTopRef = useRef<HTMLDivElement>(null);
  const { data, perPage, isPending, goToPage } = usePaginatedData(meetings, fetchPage);

  return (
    <div className={className} ref={blockTopRef}>
      <div className="flex flex-col gap-4">
        {data.docs.map((meeting) => (
          <MeetingLink key={meeting.id} meeting={meeting} />
        ))}
      </div>
      <Pagination
        page={data.page || 1}
        perPage={perPage}
        totalPages={data.totalPages}
        totalDocs={data.totalDocs}
        onPageChange={goToPage}
        isPending={isPending}
        className="mt-4"
        scrollToTopTargetRef={blockTopRef}
        scrollToTopOffset={94}
      />
    </div>
  );
};
