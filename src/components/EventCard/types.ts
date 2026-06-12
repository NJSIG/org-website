import { RequiredDataFromCollectionSlug } from 'payload';

export type EventCardData = Pick<
  RequiredDataFromCollectionSlug<'events'>,
  | 'id'
  | 'eventType'
  | 'title'
  | 'description'
  | 'startDate'
  | 'endDate'
  | 'startTime'
  | 'endTime'
  | 'categories'
  | 'trusteeMeetingAgenda'
  | 'trusteeMeetingMinutes'
  | 'important'
  | 'slug'
>;
