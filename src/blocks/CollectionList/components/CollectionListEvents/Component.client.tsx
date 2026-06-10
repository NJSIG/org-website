import { Event } from '@/payload-types';
import { PaginatedDocs } from 'payload';
import { CollectionListEventsProps } from './Component';

type CollectionListEventsClientProps = CollectionListEventsProps & {
  events: PaginatedDocs<Event> | null;
};

export const CollectionListEventsClient: React.FC<CollectionListEventsClientProps> = ({
  filters,
  searchParams,
  events,
}) => {
  console.log('CollectionListEventsClient events:', events);

  return events && events.docs.length ? (
    <ul>
      {events.docs.map((event) => (
        <li key={event.id}>
          {event.title}, {event.startDate}
        </li>
      ))}
    </ul>
  ) : (
    <p>No events found.</p>
  );
};
