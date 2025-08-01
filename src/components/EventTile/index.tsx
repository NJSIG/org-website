'use client';

import { cn } from '@/utilities/cn';
import { ArrowUpRightIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { SubfundPill } from '../SubfundPill';
import { EventTileContext, useEventTileContext } from './context';
import {
  EventDetailProps,
  EventHeaderProps,
  EventTileData,
  EventTileProps,
  NoEventsProps,
  SubscribeProps,
} from './types';

const EventTile: React.FC<EventTileProps> & {
  Header: React.FC<EventHeaderProps>;
  Detail: React.FC<EventDetailProps>;
  NoEvents: React.FC<NoEventsProps>;
  Subscribe: React.FC<SubscribeProps>;
} = ({ event, className, children }) => {
  const tileClasses = cn(
    'group/event-card p-4 flex flex-col rounded-3xl bg-[var(--event-card)] text-[var(--event-card-foreground)] min-h-52 min-w-52',
    {
      'cursor-pointer': event !== undefined,
      'bg-linear-to-tr from-[var(--event-card-bespoke-dark)] from-30% to-[var(--event-card-bespoke-light)] text-[var(--event-card-bespoke-foreground)]':
        event === 'all',
    },
    className,
  );

  const href = event ? (event === 'all' ? '/events' : generateEventLink(event)) : undefined;
  const startDate = typeof event === 'object' ? new Date(event.startDate) : null;
  const startTime = typeof event === 'object' ? new Date(event.startTime) : null;

  const formattedDate = startDate
    ? new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' }).format(startDate)
    : undefined;

  const formattedTime = startTime
    ? new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(startTime)
    : undefined;

  return (
    <EventTileContext.Provider value={{ event, formattedDate, formattedTime }}>
      {href ? (
        <Link href={href} className={tileClasses}>
          {children}
        </Link>
      ) : (
        <div className={tileClasses}>{children}</div>
      )}
    </EventTileContext.Provider>
  );
};

EventTile.Header = function Header({ heading, className }: EventHeaderProps) {
  const { event, formattedDate } = useEventTileContext();
  const title = heading
    ? heading.toUpperCase()
    : formattedDate || (event === 'all' ? 'ALL EVENTS' : 'EVENT');

  return (
    <div className={cn('flex items-center justify-between w-full', className)}>
      <span className="text-xl font-bold uppercase">{title}</span>
      <ArrowUpRightIcon
        className={cn('group-hover/event-card:motion-safe:animate-micro-up-right', {
          'stroke-[var(--event-card-bespoke-accent)]': event === 'all',
        })}
      />
    </div>
  );
};

EventTile.Detail = function Detail({ content: contentFromProps, className }: EventDetailProps) {
  const { event, formattedTime } = useEventTileContext();
  const content = contentFromProps
    ? contentFromProps
    : event === 'all'
      ? 'View our full calendar of upcoming training and meeting events as well as important dates.'
      : event?.title || null;

  return (
    <div className={cn('flex flex-col mt-2 text-left grow', className)}>
      {formattedTime ? <small className="text-sm font-medium">{formattedTime}</small> : null}
      {content ? <p>{content}</p> : null}
      {event !== 'all' &&
        event?.categories &&
        Array.isArray(event.categories) &&
        event.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {event.categories.map((category) => {
              if (
                typeof category !== 'object' ||
                !category ||
                !category.id ||
                !category.slug ||
                !category.name
              ) {
                return null;
              }

              return <SubfundPill key={category.id} theme={category.slug} label={category.name} />;
            })}
          </div>
        )}
    </div>
  );
};

EventTile.NoEvents = function NoEvents({
  message = 'No Upcoming Events',
  className,
}: NoEventsProps) {
  return (
    <div className={cn('h-full w-full flex items-center justify-center', className)}>
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
};

EventTile.Subscribe = function Subscribe({ className }: SubscribeProps) {
  // TODO: Implement Subscribe Form
  return null;
};

const generateEventLink = (event: EventTileData): string => {
  const { slug, startDate } = event;
  const date = new Date(startDate);

  return `/events/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/${slug}`;
};

export default EventTile;
