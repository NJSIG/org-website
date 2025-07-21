import { Event, EventCardsBlock as EventCardsBlockProps, EventCategory } from '@/payload-types';
import configPromise from '@payload-config';
import { draftMode } from 'next/headers';
import { getPayload, RequiredDataFromCollectionSlug, Where } from 'payload';

const queryEvents = async (
  limit: number,
  categoryFilters?: EventCardsBlockProps['categoryFilters'],
): Promise<Event[] | null> => {
  console.log('Fetching events with limit:', limit, 'and category filters:', categoryFilters);

  const { isEnabled: draft } = await draftMode();

  const where: Where | undefined =
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
      : undefined;

  const payload = await getPayload({ config: configPromise });
  const events = await payload.find({
    collection: 'events',
    draft,
    limit,
    pagination: false,
    overrideAccess: draft,
    where,
    sort: '-startDate',
  });

  return events.docs || null;
};

export const EventCardsBlock: React.FC<EventCardsBlockProps> = async (props) => {
  const { cards, categoryFilters, showViewAll, enableSubscribe } = props;

  const limit = cards - (showViewAll ? 1 : 0);

  const events: RequiredDataFromCollectionSlug<'events'>[] | null = await queryEvents(
    limit,
    categoryFilters,
  );
  console.log('EventCardsBlock props:', props);

  return <p>Event Cards Block works!</p>;
};
