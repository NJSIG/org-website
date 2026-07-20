import { EventTileData } from '@/components/EventTile/types';
import { LivePreviewListener } from '@/components/LivePreviewListener';
import { MeetingMaterialsData } from '@/components/MeetingMaterialsList/types';
import { Event, EventCategory } from '@/payload-types';
import { generateSubfundMetaGraph } from '@/utilities/generateSubfundMetaGraph';
import configPromise from '@payload-config';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPayload, Where } from 'payload';
import { cache } from 'react';
import SubfundPageClient from './page.client';

type Args = {
  params: Promise<{ slug: string }>;
};

const querySubfundBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode();
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: 'subfunds',
    draft,
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return result.docs?.[0] || null;
});

const queryEventsByCategory = cache(
  async ({ categories }: { categories: Event['categories'] }): Promise<EventTileData[]> => {
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
        .map((category) => ({ categories: { equals: category.id } })),
    };

    const where: Where = {
      and: [
        {
          startDate: {
            greater_than_equal: today,
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
        categories: true,
      },
      sort: 'startDate',
    });

    return result.docs || [];
  },
);

const queryPastMeetingsByCategory = cache(
  async ({ categories }: { categories: Event['categories'] }): Promise<MeetingMaterialsData[]> => {
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
        .map((category) => ({ categories: { equals: category.id } })),
    };

    const where: Where = {
      and: [
        {
          startDate: {
            less_than: today,
          },
        },
        {
          eventType: {
            equals: 'subfundMeeting',
          },
        },
        {
          resourceCount: {
            greater_than: 0,
          },
        },
        categoryFilter,
      ],
    };

    const result = await payload.find({
      collection: 'events',
      draft,
      limit: 5,
      pagination: false,
      where,
      depth: 1,
      select: {
        id: true,
        slug: true,
        startDate: true,
        eventType: true,
        title: true,
        categories: true,
        resources: true,
      },
      sort: '-startDate',
    });

    return result.docs || [];
  },
);

/**
 * This function generates metadata for the event page based on its slug.
 */
export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise;
  const subfund = await querySubfundBySlug({ slug });

  return generateSubfundMetaGraph({ doc: subfund });
}

/**
 * This function is used to render the subfund based on its slug.
 * It queries the subfund from the Payload CMS and checks if it exists.
 * If the subfund does not exist, it redirects to the subfunds page.
 * If the subfund exists, it renders the subfund page with the subfund data.
 */
export default async function SubfundPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode();
  const { slug } = await paramsPromise;
  const subfund = await querySubfundBySlug({ slug });

  if (!subfund) {
    redirect('/sub-funds');
  }

  const upcomingEvents = await queryEventsByCategory({
    categories: subfund.content.eventFilters,
  });

  const pastMeetings = await queryPastMeetingsByCategory({
    categories: subfund.content.pastMeetingsFilters,
  });

  return (
    <>
      <SubfundPageClient
        subfund={subfund}
        upcomingEvents={upcomingEvents}
        pastMeetings={pastMeetings}
      />
      {draft && <LivePreviewListener />}
    </>
  );
}
