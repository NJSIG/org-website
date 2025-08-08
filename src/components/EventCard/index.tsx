'use client';

import { Event } from '@/payload-types';
import { cn } from '@/utilities/cn';
import { generateEventLink } from '@/utilities/generateEventLink';
import { ArrowUpRightIcon } from 'lucide-react';
import Link from 'next/link';
import RichText from '../RichText';
import { SubfundPill } from '../SubfundPill';
import { EventCardData } from './types';

const EventCard: React.FC<{ event: EventCardData }> = ({ event }) => {
  const { eventType, startDate, title, description, categories } = event;
  const href = generateEventLink(event);

  return (
    <article
      className={cn('rounded-3xl group/event-card', {
        'bg-[var(--event-theme-trustee-background)] text-[var(--event-theme-trustee-foreground)]':
          eventType === 'trusteeMeeting',
        'bg-[var(--event-theme-subfund-background)] text-[var(--event-theme-subfund-foreground)]':
          eventType === 'subfundMeeting',
        'bg-[var(--event-theme-important-background)] text-[var(--event-theme-important-foreground)]':
          eventType === 'importantDate',
      })}
    >
      <Link href={href} className="flex">
        <EventDateLabel eventType={eventType} startDate={startDate} />
        <div className="flex flex-col gap-4 grow pl-4 py-3.5">
          <div className="flex flex-col gap-2">
            <EventTypeLabel eventType={eventType} />
            <h3 className="font-bold">{title}</h3>
            {description && <RichText className="text-xs" enableProse={false} data={description} />}
          </div>
          {categories && categories.length > 0 && (
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

                return (
                  <SubfundPill key={category.id} theme={category.slug} label={category.name} />
                );
              })}
            </div>
          )}
        </div>
        <div className="py-3.5 pr-5 hidden lg:block">
          <ArrowUpRightIcon
            className={cn(
              'opacity-0 group-hover/event-card:opacity-100 group-hover/event-card:animate-micro-up-right',
              {
                'stroke-[var(--event-theme-trustee-accent)]': eventType === 'trusteeMeeting',
                'stroke-[var(--event-theme-subfund-accent)]': eventType === 'subfundMeeting',
                'stroke-[var(--event-theme-important-accent)]': eventType === 'importantDate',
              },
            )}
          />
        </div>
      </Link>
    </article>
  );
};

const EventDateLabel: React.FC<{ eventType: Event['eventType']; startDate: string }> = ({
  eventType,
  startDate: startDateFromProps,
}) => {
  const startDate = new Date(startDateFromProps);
  const formattedMonth = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(startDate);
  const formattedDay = new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(startDate);
  const formattedAriaLabel = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(startDate);

  return (
    <div
      aria-label={`Event on ${formattedAriaLabel}`}
      className={cn('w-24 rounded-3xl flex flex-col items-center justify-center shrink-0', {
        'bg-[var(--event-theme-trustee-accent)] text-[var(--event-theme-trustee-accent-foreground)]':
          eventType === 'trusteeMeeting',
        'bg-[var(--event-theme-subfund-accent)] text-[var(--event-theme-subfund-accent-foreground)]':
          eventType === 'subfundMeeting',
        'bg-[var(--event-theme-important-accent)] text-[var(--event-theme-important-accent-foreground)]':
          eventType === 'importantDate',
      })}
    >
      <span className="text-xl font-bold uppercase">{formattedMonth}</span>
      <span className="text-5xl font-light">{formattedDay}</span>
    </div>
  );
};

const EventTypeLabel: React.FC<{ eventType: string }> = ({ eventType }) => {
  let eventTypeLabel = 'Unknown Event Type';

  switch (eventType) {
    case 'trusteeMeeting':
      eventTypeLabel = 'Board of Trustees Meeting';
      break;
    case 'subfundMeeting':
      eventTypeLabel = 'Sub-fund Meeting';
      break;
    case 'importantDate':
      eventTypeLabel = 'Important Date';
      break;
  }

  return (
    <div className="flex items-center gap-1">
      <span
        className={cn('size-1.5 rounded-full', {
          'bg-[var(--event-theme-trustee-accent)]': eventType === 'trusteeMeeting',
          'bg-[var(--event-theme-subfund-accent)]': eventType === 'subfundMeeting',
          'bg-[var(--event-theme-important-accent)]': eventType === 'importantDate',
        })}
      ></span>
      <span className="text-2xs">{eventTypeLabel}</span>
    </div>
  );
};

export default EventCard;
