import type { Event } from '@/payload-types';
import { PaginatedDocs, RequiredDataFromCollectionSlug } from 'payload';

export type PastMeetingsData = Pick<
  RequiredDataFromCollectionSlug<'events'>,
  'id' | 'slug' | 'startDate' | 'title' | 'presentationTitle'
>;

export type PastMeetingsListProps = {
  meetings: PaginatedDocs<Event>;
  className?: string;
};

export type PastMeetingsProps = {
  meeting: PastMeetingsData;
};
