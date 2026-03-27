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
import { useHasHydrated } from '../hooks/useHasHydrated';
import { EventCardData } from './types';

const EventCard: React.FC<{ event: EventCardData }> = ({ event }) => {
  const { eventType, startDate, endDate, title, categories, important } = event;
  const href = generateEventLink(event);

  return (
    <article
      className={cn(
        'event-theme',
        {
          'event-theme-trustee': eventType === 'trusteeMeeting',
          'event-theme-subfund': eventType === 'subfundMeeting',
          'event-theme-njsig': eventType === 'njsigEvent',
          'event-theme-other': eventType === 'otherEvent',
          'event-theme-important': eventType === 'importantDate',
          'border-2 border-(--event-theme-accent)': important || eventType === 'importantDate',
        },
        'rounded-3xl group/event-card relative overflow-hidden bg-njsig-neutral-tint p-4 hover:bg-(--event-theme-accent)/15 transition-colors cursor-pointer',
      )}
    >
      <Link href={href}>
        <EventCardLabel startDate={startDate} endDate={endDate} />
        <h3 className="font-light tracking-wide text-2xl mb-4">{title}</h3>
        <div className="flex items-start justify-between gap-2">
          <EventCardType eventType={eventType} important={important} />
          {categories && categories.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap justify-end">
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

const EventCardLabel: React.FC<{
  startDate: string;
  endDate?: string | null;
}> = ({ startDate: startDateFromProps, endDate: endDateFromProps }) => {
  const hydrated = useHasHydrated();

  const startDate = hydrated ? new Date(startDateFromProps) : null;
  const endDate = hydrated && endDateFromProps ? new Date(endDateFromProps) : undefined;

  const formattedStartMonth = startDate
    ? new Intl.DateTimeFormat('en-US', { month: 'short' }).format(startDate).toUpperCase()
    : undefined;

  const formattedStartDay = startDate
    ? new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(startDate)
    : undefined;

  const formattedEndMonth = endDate
    ? new Intl.DateTimeFormat('en-US', { month: 'short' }).format(endDate).toUpperCase()
    : undefined;

  const formattedEndDay = endDate
    ? new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(endDate)
    : undefined;

  return (
    <small className="flex items-center justify-between text-(--event-theme-shade)">
      <span className="text-sm font-semibold">
        {hydrated && formattedStartMonth && formattedStartDay ? (
          <>
            <time dateTime={startDateFromProps}>
              {formattedStartMonth} {formattedStartDay}
            </time>
            {endDateFromProps && (
              <>
                {' - '}
                <time dateTime={endDateFromProps}>
                  {formattedEndMonth !== formattedStartMonth ? formattedEndMonth : ''}{' '}
                  {formattedEndDay}
                </time>
              </>
            )}
          </>
        ) : (
          <span className="inline-block h-4 w-24 rounded bg-foreground/10 align-middle animate-pulse" />
        )}
      </span>
      <ArrowUpRightIcon size={24} className="group-hover/event-card:animate-micro-up-right" />
    </small>
  );
};

export const EventCardType: React.FC<
  Pick<Event, 'eventType' | 'important'> & { iconSize?: number; className?: string }
> = ({ eventType, important, iconSize = 14, className: classNameFromProps }) => {
  const className = cn(
    'inline-flex items-center gap-1 text-sm text-(--event-theme-shade) shrink-0',
    classNameFromProps,
  );

  switch (eventType) {
    case 'trusteeMeeting':
      return (
        <span className={className}>
          <UsersIcon size={iconSize} />
          {important && <CircleAlertIcon size={iconSize} />}
          <span>Board of Trustees Meeting</span>
        </span>
      );
    case 'subfundMeeting':
      return (
        <span className={className}>
          <BoxesIcon size={iconSize} />
          {important && <CircleAlertIcon size={iconSize} />}
          <span>Sub-fund Meeting</span>
        </span>
      );
    case 'njsigEvent':
      return (
        <span className={className}>
          <TriangleIcon size={iconSize} />
          {important && <CircleAlertIcon size={iconSize} />}
          <span>NJSIG Event</span>
        </span>
      );
    case 'otherEvent':
      return (
        <span className={className}>
          <ShapesIcon size={iconSize} />
          {important && <CircleAlertIcon size={iconSize} />}
          <span>Other Event</span>
        </span>
      );
    case 'importantDate':
      return (
        <span className={className}>
          <CircleAlertIcon size={iconSize} />
          <span>Important Date</span>
        </span>
      );
    default:
      return (
        <span className={className}>
          <CalendarX2Icon size={iconSize} />
          {important && <CircleAlertIcon size={iconSize} />}
          <span>Unknown Event Type</span>
        </span>
      );
  }
};

export default EventCard;
