import { RequiredDataFromCollectionSlug } from 'payload';

export type EventCardData = Pick<
  RequiredDataFromCollectionSlug<'events'>,
  'id' | 'slug' | 'startDate' | 'startTime' | 'endDate' | 'eventType' | 'title' | 'categories'
>;
