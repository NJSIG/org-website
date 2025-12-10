'use client';

import { Event } from '@/payload-types';
import { cn } from '@/utilities/cn';
import { generateEventLink } from '@/utilities/generateEventLink';
import {
  ArrowUpRightIcon,
  BoxesIcon,
  CalendarX2Icon,
  CircleAlertIcon,
  ShapesIcon,
  TriangleIcon,
  UsersIcon,
} from 'lucide-react';
import Link from 'next/link';
import { SubfundPill } from '../SubfundPill';
import { EventCardData } from './types';

const EventCard: React.FC<{ event: EventCardData }> = ({ event }) => {
  const { eventType, startDate, endDate, title, categories } = event;
  const href = generateEventLink(event);

  return (
    <article
      className={cn(
        {
          'event-theme-trustee': eventType === 'trusteeMeeting',
          'event-theme-subfund': eventType === 'subfundMeeting',
          'event-theme-njsig': eventType === 'njsigEvent',
          'event-theme-other': eventType === 'otherEvent',
          'event-theme-important': eventType === 'importantDate',
        },
        'rounded-3xl group/event-card relative overflow-hidden bg-njsig-neutral-tint p-4 hover:bg-(--event-theme-accent)/15 transition-colors cursor-pointer',
      )}
    >
      <Link href={href}>
        <EventLabel startDate={startDate} endDate={endDate} />
        <h3 className="font-light tracking-wide text-2xl mb-4">{title}</h3>
        <div className="flex items-center justify-between">
          <EventType eventType={eventType} />
          {categories && categories.length > 0 && (
            <div className="flex items-center gap-1">
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

                return (
                  <SubfundPill
                    key={category.id}
                    theme={category.slug}
                    label={category.name.toUpperCase()}
                  />
                );
              })}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
};

const EventLabel: React.FC<{
  startDate: string;
  endDate?: string | null;
}> = ({ startDate: startDateFromProps, endDate: endDateFromProps }) => {
  const startDate = new Date(startDateFromProps);
  const endDate = endDateFromProps ? new Date(endDateFromProps) : undefined;

  const formattedStartMonth = new Intl.DateTimeFormat('en-US', { month: 'short' })
    .format(startDate)
    .toUpperCase();

  const formattedStartDay = new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(startDate);

  const formattedEndMonth = endDate
    ? new Intl.DateTimeFormat('en-US', { month: 'short' }).format(endDate).toUpperCase()
    : undefined;

  const formattedEndDay = endDate
    ? new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(endDate)
    : undefined;
  return (
    <small className="flex items-center justify-between text-(--event-theme-shade)">
      <span className="text-sm font-semibold">
        <time dateTime={startDate.toString()}>
          {formattedStartMonth} {formattedStartDay}
        </time>
        {endDate && (
          <>
            {' - '}
            <time dateTime={endDate.toString()}>
              {formattedEndMonth !== formattedStartMonth ? formattedEndMonth : ''} {formattedEndDay}
            </time>
          </>
        )}
      </span>
      <ArrowUpRightIcon size={24} className="group-hover/event-card:animate-micro-up-right" />
    </small>
  );
};

const EventType: React.FC<Pick<Event, 'eventType'>> = ({ eventType }) => {
  const iconSize = 14;
  const spanClassName = 'inline-flex items-center gap-1 text-sm text-(--event-theme-shade)';

  switch (eventType) {
    case 'trusteeMeeting':
      return (
        <span className={spanClassName}>
          <UsersIcon size={iconSize} />
          <span>Board of Trustees Meeting</span>
        </span>
      );
    case 'subfundMeeting':
      return (
        <span className={spanClassName}>
          <BoxesIcon size={iconSize} />
          <span>Sub-fund Meeting</span>
        </span>
      );
    case 'njsigEvent':
      return (
        <span className={spanClassName}>
          <TriangleIcon size={iconSize} />
          <span>NJSIG Event</span>
        </span>
      );
    case 'otherEvent':
      return (
        <span className={spanClassName}>
          <ShapesIcon size={iconSize} />
          <span>Other Event</span>
        </span>
      );
    case 'importantDate':
      return (
        <span className={spanClassName}>
          <CircleAlertIcon size={iconSize} />
          <span>Important Date</span>
        </span>
      );
    default:
      return (
        <span className={spanClassName}>
          <CalendarX2Icon size={iconSize} />
          <span>Unknown Event Type</span>
        </span>
      );
  }
};

export default EventCard;
