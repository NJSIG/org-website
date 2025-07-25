import { EventCard, EventCardData } from '@/components/EventCard';
import { EventCardsBlock as EventCardsBlockProps, EventCategory } from '@/payload-types';
import { cn } from '@/utilities/cn';
import configPromise from '@payload-config';
import { draftMode } from 'next/headers';
import { getPayload, Where } from 'payload';

const queryEvents = async (
  limit: number,
  categoryFilters?: EventCardsBlockProps['categoryFilters'],
): Promise<EventCardData[] | null> => {
  const { isEnabled: draft } = await draftMode();
  const today = new Date().toISOString();

  const categoryFilter: Where =
    categoryFilters && Array.isArray(categoryFilters) && categoryFilters.length > 0
      ? {
          or: categoryFilters
            .filter((category): category is EventCategory =>
              Boolean(category && typeof category === 'object' && 'id' in category),
            )
            .map((category) => ({
              category: {
                equals: category.id,
              },
            })),
        }
      : {};

  const where: Where = {
    and: [
      {
        startDate: {
          greater_than_equal: today,
        },
      },
      {
        _status: {
          equals: 'published',
        },
      },
      categoryFilter,
    ],
  };

  const payload = await getPayload({ config: configPromise });
  const events = await payload.find({
    collection: 'events',
    draft,
    limit,
    pagination: false,
    where,
    depth: 1,
    select: {
      id: true,
      slug: true,
      startDate: true,
      startTime: true,
      eventType: true,
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

  let events: EventCardData[] | null = null;

  try {
    events = await queryEvents(limit, categoryFilters);
  } catch (error) {
    console.error('Error fetching events:', error);

    return (
      <div className="flex items-center justify-center">
        <p>Error loading events. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {events &&
        events.length > 0 &&
        events.map((event) => (
          <EventCard
            key={event.id}
            cardType="event"
            event={event}
            className={cn({
              'lg:col-span-3': cards === 4,
              'lg:col-span-4': cards === 3,
              'lg:col-span-6': cards === 2,
              'lg:col-span-12': cards === 1,
            })}
          />
        ))}

      {showViewAll && (
        <EventCard
          cardType="viewAll"
          className={cn({
            'lg:col-span-3': cards === 4,
            'lg:col-span-4': cards === 3,
            'lg:col-span-6': cards === 2,
            'lg:col-span-12': cards === 1,
          })}
        />
      )}

      {(!events || events.length <= 0) && enableSubscribe && (
        <EventCard
          cardType="subscribe"
          className={cn({
            'lg:col-span-9': cards === 4,
            'lg:col-span-8': cards === 3,
            'lg:col-span-6': cards === 2,
            'lg:col-span-12': cards === 1,
          })}
        />
      )}
    </div>
  );
};
