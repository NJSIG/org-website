import ResourceList from '@/components/ResourceList';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/primitives/ui/accordion';
import { usePathname, useRouter, useSearchParams } from 'next/dist/client/components/navigation';
import { useEffect, useRef } from 'react';
import { Pagination } from '../Pagination';
import { MeetingHeader } from './components/MeetingHeader';
import { MeetingMaterialsListProps } from './types';

export const MeetingMaterialsList: React.FC<MeetingMaterialsListProps> = ({
  meetings,
  className,
}) => {
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
    <div className={className}>
      <Accordion type="multiple">
        {meetings.docs.map((meeting) => (
          <AccordionItem key={meeting.id} value={meeting.title}>
            <AccordionTrigger>
              <MeetingHeader meeting={meeting} />
            </AccordionTrigger>
            <AccordionContent>
              <ResourceList resources={meeting.resources} nested />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Pagination
        totalDocs={meetings.totalDocs}
        pageSizes={[5]}
        defaultPageSize={5}
        className="mt-4"
        scrollToTopTargetRef={blockTopRef}
        scrollToTopOffset={48}
      />
    </div>
  );
};
