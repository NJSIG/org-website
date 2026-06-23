'use server';

import { Temporal } from '@js-temporal/polyfill';
import configPromise from '@payload-config';
import { draftMode } from 'next/headers';
import { getPayload, Where } from 'payload';
import { cache } from 'react';
import { CollectionListLegalNoticesProps } from './Component';

export const queryLegalNotices = cache(
  async ({ filters, searchParams }: CollectionListLegalNoticesProps) => {
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
        types: {
          in: filters.types,
        },
      });
    }

    // Apply Date Range Filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = Temporal.Now.plainDateISO().toString();

      if (filters.dateRange === 'upcoming') {
        where.and?.push({
          startDate: {
            greater_than_equal: now,
          },
        });
      }

      if (filters.dateRange === 'past') {
        where.and?.push({
          startDate: {
            less_than: now,
          },
        });
      }

      if (filters.dateRange === 'custom' && filters.rangeStart) {
        const rangeStart = Temporal.PlainDate.from(filters.rangeStart.slice(0, 10)).toString();

        where.and?.push({
          startDate: {
            greater_than_equal: rangeStart,
          },
        });

        if (filters.rangeEnd) {
          const rangeEnd = Temporal.PlainDate.from(filters.rangeEnd.slice(0, 10)).toString();

          where.and?.push({
            startDate: {
              less_than_equal: rangeEnd,
            },
          });
        }
      }
    }

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
      const limitParam = searchParams?.limit;
      const pageParam = searchParams?.page;

      const limit = Math.max(
        1,
        Number(Array.isArray(limitParam) ? limitParam[0] : limitParam) || 10,
      );
      const page = Math.max(1, Number(Array.isArray(pageParam) ? pageParam[0] : pageParam) || 1);

      const result = await payload.find({
        collection: 'legal-notices',
        draft,
        pagination: true,
        limit,
        page,
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
