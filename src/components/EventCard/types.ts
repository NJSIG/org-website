import { RequiredDataFromCollectionSlug } from 'payload';

export enum EventCardTemplates {
  Default = 'default',
  TrusteeMeeting = 'trusteeMeeting',
}

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
