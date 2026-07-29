import type { Event } from '@/payload-types';
import { PaginatedDocs } from 'payload';

export type PastMeetingsListProps = {
  meetings: PaginatedDocs<Event>;
  className?: string;
};
