'use client';

import { cn } from '@/utilities/cn';
import { generateEventLink } from '@/utilities/generateEventLink';
import { ArrowUpRightIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { SubfundPill } from '../SubfundPill';
import { EventTileContext, useEventTileContext } from './context';
import {
  EventDetailProps,
  EventHeaderProps,
  EventTileProps,
  NoEventsProps,
  SubscribeProps,
} from './types';

const EventTile: React.FC<EventTileProps> = ({ event, className, children }) => {
  const tileClasses = cn(
    'group/event-tile rounded-3xl bg-(--event-tile) text-(--event-tile-foreground) min-h-52 min-w-52 transition-colors relative',
    {
      'cursor-pointer hover:bg-mix-shade-(--event-tile)/2': event !== undefined,
      'relative bg-transparent hover:bg-mix-shade-(--event-tile-bespoke-light)/2 before:absolute before:-z-1 before:top-0 before:left-0 before:w-full before:h-full before:rounded-3xl before:bg-linear-to-tr before:from-(--event-tile-bespoke-dark) before:from-30% before:to-(--event-tile-bespoke-light) text-(--event-tile-bespoke-foreground)':
        event === 'all',
    },
    className,
  );

  const href = event ? (event === 'all' ? '/events' : generateEventLink(event)) : undefined;
  const startDate = typeof event === 'object' ? new Date(event.startDate) : null;
  const startTime = typeof event === 'object' ? new Date(event.startTime) : null;

  const formattedMonth = startDate
    ? new Intl.DateTimeFormat('en-US', { month: 'short' }).format(startDate)
    : undefined;

  const formattedDay = startDate
    ? new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(startDate)
    : undefined;

  const formattedDate =
    formattedMonth && formattedDay ? `${formattedDay} ${formattedMonth}` : undefined;

  const formattedTime = startTime
    ? new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(startTime)
    : undefined;

  return (
    <EventTileContext.Provider value={{ event, formattedDate, formattedTime }}>
      {href ? (
        <article className={tileClasses}>
          <Link href={href} className="flex flex-col p-4 w-full h-full">
            {children}
          </Link>
        </article>
      ) : (
        <div className={tileClasses}>{children}</div>
      )}
    </EventTileContext.Provider>
  );
};

const EventTileHeader: React.FC<EventHeaderProps> = ({ heading, className }) => {
  const { event, formattedDate } = useEventTileContext();
  const title = heading
    ? heading.toUpperCase()
    : formattedDate || (event === 'all' ? 'ALL EVENTS' : 'EVENT');

  return (
    <div className={cn('flex items-center justify-between w-full', className)}>
      <h4 className="text-xl font-bold uppercase">{title}</h4>
      <ArrowUpRightIcon
        className={cn('group-hover/event-tile:motion-safe:animate-micro-up-right', {
          'stroke-(--event-tile-bespoke-accent)': event === 'all',
        })}
      />
    </div>
  );
};

const EventTileDetail: React.FC<EventDetailProps> = ({ content: contentFromProps, className }) => {
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

const EventTileNoEvents: React.FC<NoEventsProps> = ({
  message = 'No Upcoming Events',
  className,
}) => {
  return (
    <div className={cn('h-full w-full flex items-center justify-center', className)}>
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
};

const EventTileSubscribe: React.FC<SubscribeProps> = (
  {
    /* className */
  },
) => {
  // TODO: Implement Subscribe Form
  return null;
};

export { EventTile, EventTileDetail, EventTileHeader, EventTileNoEvents, EventTileSubscribe };
