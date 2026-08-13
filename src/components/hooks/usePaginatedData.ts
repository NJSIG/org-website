'use client';

import { PaginatedDocs } from 'payload';
import { useState, useTransition } from 'react';

export type FetchPageArgs = { page: number; perPage: number };
export type FetchPage<T> = (args: FetchPageArgs) => Promise<PaginatedDocs<T> | null>;

/**
 * Manages paginated data client-side by calling a server action for each page/perPage change,
 * avoiding URL query params so multiple paginated lists can coexist on one page.
 */
export const usePaginatedData = <T>(initialData: PaginatedDocs<T>, fetchPage: FetchPage<T>) => {
  const [data, setData] = useState(initialData);
  const [perPage, setPerPage] = useState(initialData.limit);
  const [isPending, startTransition] = useTransition();

  const goToPage = (page: number) => {
    startTransition(async () => {
      const result = await fetchPage({ page, perPage });

      if (result) {
        setData(result);
      }
    });
  };

  const changePerPage = (nextPerPage: number) => {
    startTransition(async () => {
      const result = await fetchPage({ page: 1, perPage: nextPerPage });

      if (result) {
        setPerPage(nextPerPage);
        setData(result);
      }
    });
  };

  return { data, perPage, isPending, goToPage, changePerPage };
};
