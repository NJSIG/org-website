import { RequiredDataFromCollectionSlug } from 'payload';

export type EventTileData = Pick<
  RequiredDataFromCollectionSlug<'events'>,
  'id' | 'slug' | 'startDate' | 'startTime' | 'eventType' | 'title' | 'categories'
>;

export type EventTileContextType = {
  event?: EventTileData | 'all';
  formattedDate?: string;
  formattedTime?: string;
};

export type EventTileProps = {
  event?: EventTileData | 'all';
  withGradient?: boolean;
  className?: string;
  children: React.ReactNode;
};

export type EventHeaderProps = {
  heading?: string;
  className?: string;
};

export type EventDetailProps = {
  content?: string;
  className?: string;
};

export type NoEventsProps = {
  message?: string;
  className?: string;
};

export type SubscribeProps = {
  className?: string;
};
