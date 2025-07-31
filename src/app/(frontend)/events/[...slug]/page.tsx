import { EventTileData } from '@/components/EventTile/types';
import { LivePreviewListener } from '@/components/LivePreviewListener';
import { Event, EventCategory } from '@/payload-types';
import { generateEventMetaGraph } from '@/utilities/generateEventMetaGraph';
import configPromise from '@payload-config';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPayload, Where } from 'payload';
import { cache } from 'react';
import EventPageClient from './page.client';

type Args = {
  params: Promise<{ slug?: string[] }>;
};

const queryEventByDateAndSlug = cache(async ({ slug }: { slug: string[] }) => {
  if (!slug || slug.length < 4) {
    return null; // Invalid slug format
  }

  const { isEnabled: draft } = await draftMode();
  const payload = await getPayload({ config: configPromise });

  const startDate = new Date(`${slug[0]}-${slug[1]}-${slug[2]}`);

  const result = await payload.find({
    collection: 'events',
    draft,
    limit: 1,
    pagination: false,
    where: {
      startDate: {
        greater_than_equal: startDate.toISOString(),
      },
      slug: {
        equals: slug[3],
      },
    },
  });

  return result.docs?.[0] || null;
});

const queryRelatedEventsByCategory = cache(
  async ({
    currentId,
    categories,
  }: {
    currentId: string;
    categories: Event['categories'];
  }): Promise<EventTileData[]> => {
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return [];
    }

    const { isEnabled: draft } = await draftMode();
    const payload = await getPayload({ config: configPromise });

    const today = new Date().toISOString();
    const categoryFilter: Where = {
      or: categories
        .filter((category): category is EventCategory =>
          Boolean(category && typeof category === 'object' && 'id' in category),
        )
        .map((category) => ({ category: { equals: category.id } })),
    };

    const where: Where = {
      and: [
        {
          id: {
            not_equals: currentId,
          },
        },
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

    const result = await payload.find({
      collection: 'events',
      draft,
      limit: 2,
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

    return result.docs || [];
  },
);

/**
 * This function generates metadata for the event page based on its slug.
 */
export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = [] } = await paramsPromise;
  const event = await queryEventByDateAndSlug({ slug });

  return generateEventMetaGraph({ doc: event });
}

/**
 * This function is used to render the event based on its slug.
 * It queries the event from the Payload CMS and checks if it exists.
 * If the event does not exist, it redirects to the events page.
 * If the event exists, it renders the event page with the event data.
 */
export default async function EventPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode();
  const { slug = [] } = await paramsPromise;
  const event = await queryEventByDateAndSlug({ slug });

  if (!event) {
    redirect('/events');
  }

  const relatedEvents = await queryRelatedEventsByCategory({
    currentId: event.id,
    categories: event.categories,
  });

  return (
    <article>
      <EventPageClient event={event} related={relatedEvents} />
      {draft && <LivePreviewListener />}
    </article>
  );
}
