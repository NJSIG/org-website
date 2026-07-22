'use client';

import EventCard from '@/components/EventCard';
import { EventCardTemplates } from '@/components/EventCard/types';
import { Pagination } from '@/components/Pagination';
import { Event } from '@/payload-types';
import { PaginatedDocs } from 'payload';
import { useRef } from 'react';
import { CollectionListEventsProps } from './Component';

type CollectionListEventsClientProps = CollectionListEventsProps & {
  events: PaginatedDocs<Event> | null;
};

export const CollectionListEventsClient: React.FC<CollectionListEventsClientProps> = ({
  filters,
  events,
}) => {
  const blockTopRef = useRef<HTMLDivElement>(null);

  return events && events.docs.length ? (
    <div ref={blockTopRef}>
      {filters?.pagination && <Pagination totalDocs={events.totalDocs} className="mb-4" />}
      <div className="space-y-4">
        {events.docs.map((event) => (
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
          totalDocs={events.totalDocs}
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
