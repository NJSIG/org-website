import { RequiredDataFromCollectionSlug } from 'payload';

export type MeetingMaterialsData = Pick<
  RequiredDataFromCollectionSlug<'events'>,
  'id' | 'slug' | 'startDate' | 'eventType' | 'title' | 'categories' | 'resources'
>;

export type MeetingMaterialsListProps = {
  meetings?: MeetingMaterialsData[];
  className?: string;
};

export type MeetingMaterialsProps = {
  meeting: MeetingMaterialsData;
};
