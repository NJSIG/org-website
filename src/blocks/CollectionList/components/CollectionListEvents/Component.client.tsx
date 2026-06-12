import EventCard from '@/components/EventCard';
import { EventCardTemplates } from '@/components/EventCard/types';
import { Event } from '@/payload-types';
import { PaginatedDocs } from 'payload';
import { CollectionListEventsProps } from './Component';

// TODO: Implement Pagination

type CollectionListEventsClientProps = CollectionListEventsProps & {
  events: PaginatedDocs<Event> | null;
};

export const CollectionListEventsClient: React.FC<CollectionListEventsClientProps> = ({
  filters,
  searchParams,
  events,
}) => {
  return events && events.docs.length ? (
    <div className="space-y-4">
      {events.docs.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          template={(filters?.displayTemplate || EventCardTemplates.Default) as EventCardTemplates}
        />
      ))}
    </div>
  ) : (
    <div className="rounded-3xl bg-njsig-neutral-tint p-4">
      <h3 className="text-xl font-bold">No events found.</h3>
    </div>
  );
};
