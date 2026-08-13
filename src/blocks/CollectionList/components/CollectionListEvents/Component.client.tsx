'use client';

import EventCard from '@/components/EventCard';
import { EventCardTemplates } from '@/components/EventCard/types';
import type { FetchPage } from '@/components/hooks/usePaginatedData';
import { usePaginatedData } from '@/components/hooks/usePaginatedData';
import { Pagination } from '@/components/Pagination';
import { Event } from '@/payload-types';
import { PaginatedDocs } from 'payload';
import { useRef } from 'react';
import { CollectionListEventsProps } from './Component';

const EMPTY_EVENTS: PaginatedDocs<Event> = {
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

type CollectionListEventsClientProps = CollectionListEventsProps & {
  events: PaginatedDocs<Event> | null;
  fetchPage: FetchPage<Event>;
};

export const CollectionListEventsClient: React.FC<CollectionListEventsClientProps> = ({
  filters,
  events,
  fetchPage,
}) => {
  const blockTopRef = useRef<HTMLDivElement>(null);
  const { data, perPage, isPending, goToPage } = usePaginatedData(
    events ?? EMPTY_EVENTS,
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
          isPending={isPending}
          className="mb-4"
        />
      )}
      <div className="space-y-4">
        {data.docs.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            template={
              (filters?.displayTemplate || EventCardTemplates.Default) as EventCardTemplates
            }
          />
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
          isPending={isPending}
          className="mt-4"
          scrollToTopTargetRef={blockTopRef}
          scrollToTopOffset={48}
        />
      )}
    </div>
  ) : (
    <div className="rounded-3xl bg-njsig-neutral-tint p-4">
      <h3 className="text-xl font-bold">No events found.</h3>
    </div>
  );
};
