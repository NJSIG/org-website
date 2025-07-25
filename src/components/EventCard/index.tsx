'use client';

import { EventCategory } from '@/payload-types';
import { cn } from '@/utilities/cn';
import { ArrowUpRightIcon } from 'lucide-react';
import Link from 'next/link';
import { RequiredDataFromCollectionSlug } from 'payload';
import { SubfundPill } from '../SubfundPill';

export type EventCardData = Pick<
  RequiredDataFromCollectionSlug<'events'>,
  'id' | 'slug' | 'startDate' | 'startTime' | 'eventType' | 'title' | 'category'
>;

export type EventCardProps = {
  cardType: 'event' | 'viewAll' | 'subscribe';
  event?: EventCardData | null;
  className?: string;
};

const cardClasses =
  'group/event-card p-4 flex flex-col rounded-3xl bg-[var(--event-card)] text-[var(--event-card-foreground)] min-h-52 min-w-52';

export const EventCard: React.FC<EventCardProps> = ({ cardType, event, className }) => {
  switch (cardType) {
    case 'event':
      if (!event) {
        return null;
      }

      return <SingleEventCard event={event} className={className} />;
    case 'viewAll':
      return <ViewAllCard className={className} />;
    case 'subscribe':
      return <p>Subscribe Card works!</p>;
    default:
      return null;
  }
};

const SingleEventCard: React.FC<{ event: EventCardData; className?: string }> = ({
  event,
  className,
}) => {
  if (!event?.startDate || !event?.slug) {
    return null;
  }

  const date = new Date(event.startDate);
  const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' }).format(
    new Date(event.startDate),
  );

  const time = event.startTime
    ? new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(
        new Date(event.startTime),
      )
    : 'TBA';

  return (
    <Link
      href={`/events/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/${event.slug}`}
      className={cn(cardClasses, 'cursor-pointer', className)}
    >
      <Header heading={formattedDate} />
      <Detail time={time} body={event.title} tags={event.category} />
    </Link>
  );
};

const ViewAllCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Link
      href="/events"
      className={cn(
        cardClasses,
        'cursor-pointer',
        'bg-linear-to-tr from-[var(--event-card-bespoke-dark)] from-30% to-[var(--event-card-bespoke-light)] text-[var(--event-card-bespoke-foreground)]',
        className,
      )}
    >
      <Header heading="ALL EVENTS" className="[&>svg]:stroke-[var(--event-card-bespoke-accent)]" />
      <Detail body="View our full calendar of upcoming training and meeting events as well as important dates." />
    </Link>
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
  return (
    <div className="flex flex-col mt-2 text-left grow">
      {time && <small className="text-sm font-medium">{time}</small>}
      {body && <p>{body}</p>}
      {tags && Array.isArray(tags) && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-auto">
          {tags.map((tag) => {
            if (typeof tag !== 'object' || !tag || !tag.id || !tag.slug || !tag.name) {
              return null;
            }

            return <SubfundPill key={tag.id} theme={tag.slug} label={tag.name} />;
          })}
        </div>
      )}
    </div>
  );
};
