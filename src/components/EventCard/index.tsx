'use client';

import { EventCategory } from '@/payload-types';
import { cn } from '@/utilities/cn';
import { ArrowUpRightIcon } from 'lucide-react';
import { RequiredDataFromCollectionSlug } from 'payload';
import { ElementType } from 'react';

export type EventCardData = Pick<
  RequiredDataFromCollectionSlug<'events'>,
  'id' | 'slug' | 'startDate' | 'startTime' | 'type' | 'title' | 'category'
>;

export type EventCardProps = {
  type: 'event' | 'viewAll' | 'subscribe';
  event?: EventCardData | null;
  htmlElement?: ElementType | null;
  className?: string;
};

const cardClasses =
  'group/event-card p-4 flex flex-col rounded-3xl bg-[var(--event-card)] text-[var(--event-card-foreground)]';

export const EventCard: React.FC<EventCardProps> = ({ type, event, className }) => {
  switch (type) {
    case 'event':
      if (!event) {
        return null;
      }

      return <SingleEventCard event={event} className={className} />;
    case 'viewAll':
      return <ViewAllCard className={className} />;
    case 'subscribe':
      return <p>Subscribe Card works!</p>;
  }
};

const SingleEventCard: React.FC<{ event: EventCardData; className?: string }> = ({
  event,
  className,
}) => {
  const date = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' }).format(
    new Date(event.startDate),
  );

  const time = event.startTime
    ? new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(
        new Date(event.startTime),
      )
    : 'TBA';

  return (
    <button className={cn(cardClasses, 'cursor-pointer', className)}>
      <Header heading={date} />
      <Detail time={time} body={event.title} tags={event.category} />
    </button>
  );
};

const ViewAllCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <button
      className={cn(
        cardClasses,
        'cursor-pointer',
        'bg-linear-to-tr from-[var(--event-card-bespoke-dark)] from-30% to-[var(--event-card-bespoke-light)] text-[var(--event-card-bespoke-foreground)]',
        className,
      )}
    >
      <Header heading="ALL EVENTS" className="[&>svg]:stroke-[var(--event-card-bespoke-accent)]" />
      <Detail body="View our full calendar of upcoming training and meeting events as well as important dates." />
    </button>
  );
};

const Header: React.FC<{ heading: string; className?: string }> = ({ heading, className }) => {
  return (
    <div className={cn('flex items-center justify-between w-full', className)}>
      <span className="text-xl font-bold uppercase">{heading}</span>
      <ArrowUpRightIcon className="group-hover/event-card:motion-safe:animate-micro-up-right" />
    </div>
  );
};

const Detail: React.FC<{ time?: string; body?: string; tags?: (string | EventCategory)[] }> = ({
  time,
  body,
  tags,
}) => {
  console.log('tags', tags);
  return (
    <div className="flex flex-col mt-2">
      {time && <small className="text-sm font-medium">{time}</small>}
      {body && <p>{body}</p>}
      {tags && tags.length > 0 && <div className="flex flex-wrap gap-2 mt-auto"></div>}
    </div>
  );
};
