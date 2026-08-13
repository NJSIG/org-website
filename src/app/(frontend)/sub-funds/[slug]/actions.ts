'use server';

import type { Event, EventCategory } from '@/payload-types';
import configPromise from '@payload-config';
import { draftMode } from 'next/headers';
import { getPayload, PaginatedDocs, Where } from 'payload';

/**
 * Query past meetings by their categories from the Payload CMS.
 *
 * @param categories - The categories to filter past meetings by.
 * @param page - The page of results to fetch.
 * @param perPage - The number of results per page.
 * @returns An array of past meeting data.
 */
export async function queryPastMeetingsByCategory({
  categories,
  page = 1,
  perPage = 5,
}: {
  categories: Event['categories'];
  page?: number;
  perPage?: number;
}): Promise<PaginatedDocs<Event> | null> {
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return null;
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
      categoryFilter,
    ],
  };

  const limit = Math.max(1, Math.max(perPage, 5));
  const safePage = Math.max(1, page);

  const result = await payload.find({
    collection: 'events',
    draft,
    pagination: true,
    where,
    limit,
    page: safePage,
    depth: 1,
    select: {
      id: true,
      slug: true,
      startDate: true,
      title: true,
      presentationTitle: true,
    },
    sort: '-startDate',
  });

  return result;
}

// Server Action passed to the client; categories are bound in page.tsx so the client only needs to supply page/perPage.
export async function fetchPastMeetingsPage(
  categories: Event['categories'],
  { page, perPage }: { page: number; perPage: number },
) {
  return queryPastMeetingsByCategory({ categories, page, perPage });
}
