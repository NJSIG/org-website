import type { Event } from '@/payload-types';
import { PaginatedDocs, RequiredDataFromCollectionSlug } from 'payload';

export type MeetingMaterialsData = Pick<
  RequiredDataFromCollectionSlug<'events'>,
  'id' | 'slug' | 'startDate' | 'eventType' | 'title' | 'categories' | 'resources'
>;

export type MeetingMaterialsListProps = {
  meetings: PaginatedDocs<Event>;
  className?: string;
};

export type MeetingMaterialsProps = {
  meeting: MeetingMaterialsData;
};
