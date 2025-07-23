import { EventCard, EventCardData } from '@/components/EventCard';
import { EventCardsBlock as EventCardsBlockProps, EventCategory } from '@/payload-types';
import configPromise from '@payload-config';
import { draftMode } from 'next/headers';
import { getPayload, Where } from 'payload';

const queryEvents = async (
  limit: number,
  categoryFilters?: EventCardsBlockProps['categoryFilters'],
): Promise<EventCardData[] | null> => {
  const { isEnabled: draft } = await draftMode();
  const today = new Date().toISOString();

  const upcomingFilter: Where = {
    startDate: {
      greater_than_equal: today,
    },
  };

  const categoryFilter: Where =
    categoryFilters && categoryFilters.length > 0
      ? {
          or: [
            ...categoryFilters.map((category) => ({
              category: {
                equals: (category as EventCategory).id,
              },
            })),
          ],
        }
      : {};

  const where: Where = {
    and: [upcomingFilter, categoryFilter],
  };

  const payload = await getPayload({ config: configPromise });
  const events = await payload.find({
    collection: 'events',
    draft,
    limit,
    pagination: false,
    overrideAccess: draft,
    where,
    select: {
      id: true,
      slug: true,
      startDate: true,
      startTime: true,
      type: true,
      title: true,
      category: true,
    },
    sort: 'startDate',
  });

  return events.docs || null;
};

export const EventCardsBlock: React.FC<EventCardsBlockProps> = async (props) => {
  const { cards, categoryFilters, showViewAll, enableSubscribe } = props;

  const limit = cards - (showViewAll ? 1 : 0);

  const events: EventCardData[] | null = await queryEvents(limit, categoryFilters);

  return (
    <div className="flex flex-col gap-6 w-full">
      {events &&
        events.length > 0 &&
        events.map((event) => <EventCard key={event.id} type="event" event={event} />)}

      {showViewAll && <EventCard type="viewAll" />}

      {(!events || events.length <= 0) && enableSubscribe && <EventCard type="subscribe" />}
    </div>
  );
};
