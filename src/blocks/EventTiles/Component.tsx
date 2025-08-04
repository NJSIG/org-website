import {
  EventTile,
  EventTileDetail,
  EventTileHeader,
  EventTileSubscribe,
} from '@/components/EventTile';
import { EventTileData } from '@/components/EventTile/types';
import { EventCategory, EventTilesBlock as EventTilesBlockProps } from '@/payload-types';
import { cn } from '@/utilities/cn';
import configPromise from '@payload-config';
import { draftMode } from 'next/headers';
import { getPayload, Where } from 'payload';

const queryEvents = async (
  limit: number,
  categoryFilters?: EventTilesBlockProps['categoryFilters'],
): Promise<EventTileData[] | null> => {
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

export const EventTilesBlock: React.FC<EventTilesBlockProps> = async (props) => {
  const { tiles, categoryFilters, showViewAll, enableSubscribe } = props;
  const limit = tiles - (showViewAll ? 1 : 0);

  let events: EventTileData[] | null = null;

  try {
    events = await queryEvents(limit, categoryFilters);
  } catch (error) {
    console.error('Error fetching events:', error);

    return (
      <div className="flex items-center justify-center">
        <p className="text-2xl font-thin text-foreground-muted">
          <span className="font-medium">ERROR</span> | Failed to load events. Please try again
          later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {events &&
        events.length > 0 &&
        events.map((event) => (
          <EventTile
            key={event.id}
            event={event}
            className={cn({
              'lg:col-span-3': tiles === 4,
              'lg:col-span-4': tiles === 3,
              'lg:col-span-6': tiles === 2,
              'lg:col-span-12': tiles === 1,
            })}
          >
            <EventTileHeader />
            <EventTileDetail />
          </EventTile>
        ))}

      {showViewAll && (
        <EventTile
          event="all"
          className={cn({
            'lg:col-span-3': tiles === 4,
            'lg:col-span-4': tiles === 3,
            'lg:col-span-6': tiles === 2,
            'lg:col-span-12': tiles === 1,
          })}
        >
          <EventTileHeader />
          <EventTileDetail />
        </EventTile>
      )}

      {(!events || events.length <= 0) && enableSubscribe && (
        <EventTile
          className={cn({
            'lg:col-span-9': tiles === 4,
            'lg:col-span-8': tiles === 3,
            'lg:col-span-6': tiles === 2,
            'lg:col-span-12': tiles === 1,
          })}
        >
          <EventTileHeader heading="Get Notified" />
          <EventTileSubscribe />
        </EventTile>
      )}
    </div>
  );
};
