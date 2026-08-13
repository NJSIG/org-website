import type { FetchPage } from '@/components/hooks/usePaginatedData';
import type { Event } from '@/payload-types';
import { PaginatedDocs } from 'payload';

export type PastMeetingsListProps = {
  meetings: PaginatedDocs<Event>;
  fetchPage: FetchPage<Event>;
  className?: string;
};
