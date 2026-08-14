'use server';

import { Temporal } from '@js-temporal/polyfill';
import configPromise from '@payload-config';
import { draftMode } from 'next/headers';
import { getPayload, Where } from 'payload';
import { cache } from 'react';
import { CollectionListLegalNoticesProps } from './Component';

export type QueryLegalNoticesArgs = CollectionListLegalNoticesProps & {
  page?: number;
  perPage?: number;
};

export const queryLegalNotices = cache(
  async ({ filters, page = 1, perPage = 10 }: QueryLegalNoticesArgs) => {
    if (!filters) {
      return null;
    }

    const payload = await getPayload({ config: configPromise });
    const { isEnabled: draft } = await draftMode();

    const where: Where = {
      and: [],
    };

    // Apply Legal Notice Type Filter
    if (filters.types?.length) {
      where.and?.push({
        noticeType: {
          in: filters.types,
        },
      });
    }

    // Apply custom date range filter if provided, notices will additionally be filtered to only show those that have been posted (postingDate <= now)
    if (filters.dateRange && filters.dateRange === 'custom' && filters.rangeStart) {
      const rangeStart = Temporal.PlainDate.from(filters.rangeStart.slice(0, 10)).toString();

      where.and?.push({
        postingDate: {
          greater_than_equal: rangeStart,
        },
      });

      if (filters.rangeEnd) {
        const rangeEnd = Temporal.PlainDate.from(filters.rangeEnd.slice(0, 10)).toString();

        where.and?.push({
          postingDate: {
            less_than_equal: rangeEnd,
          },
        });
      }
    }

    // Apply Posting Date filter to only show legal notices that have been posted (postingDate <= now)
    const now = Temporal.Now.plainDateTimeISO().toString();

    where.and?.push({
      postingDate: {
        less_than_equal: now,
      },
    });

    // Apply Sorting
    let sort = '-postingDate';

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'postingDateAsc':
          sort = 'postingDate';
          break;
        case 'postingDateDesc':
          sort = '-postingDate';
          break;
      }
    }

    // Pagination
    if (filters.pagination) {
      const limit = Math.max(1, perPage);
      const safePage = Math.max(1, page);

      const result = await payload.find({
        collection: 'legal-notices',
        draft,
        pagination: true,
        limit,
        page: safePage,
        depth: 1,
        where,
        sort,
      });

      return result || null;
    }

    const result = await payload.find({
      collection: 'legal-notices',
      draft,
      pagination: false,
      depth: 1,
      where,
      sort,
    });

    return result || null;
  },
);
