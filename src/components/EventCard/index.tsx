'use client';

import { cn } from '@/utilities/cn';
import { ArrowUpRightIcon } from 'lucide-react';
import { RequiredDataFromCollectionSlug } from 'payload';
import { ElementType, Fragment } from 'react';

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

type ClassOverrides = {
  icon?: string;
};

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export const EventCard: React.FC<EventCardProps> = ({
  type,
  event,
  htmlElement = 'button',
  className: classNameFromProps,
}) => {
  const Tag = htmlElement || Fragment;
  const className = cn(
    'group/event-card p-4 flex flex-col rounded-3xl bg-[var(--event-card)] text-[var(--event-card-foreground)]',
    type === 'viewAll' &&
      'bg-linear-to-tr from-[var(--event-card-bespoke-dark)] via-[var(--event-card-bespoke-dark)] via-30% to-[var(--event-card-bespoke-light)] text-[var(--event-card-bespoke-foreground)]',
    htmlElement === 'button' && 'cursor-pointer',
    classNameFromProps,
  );

  if (type === 'event') {
    if (event) {
      return (
        <Tag {...(htmlElement !== null ? { className } : {})}>
          <Header heading={new Date(event.startDate)} />
        </Tag>
      );
    }
  } else {
    const classOverrides: ClassOverrides = {};
    const heading =
      type === 'viewAll' ? 'ALL EVENTS' : type === 'subscribe' ? 'NO UPCOMING EVENTS' : 'EVENT';

    if (type === 'viewAll') {
      classOverrides.icon = 'stroke-[var(--event-card-bespoke-accent)]';
    }

    return (
      <Tag {...(htmlElement !== null ? { className } : {})}>
        <Header heading={heading} className={classOverrides} />
      </Tag>
    );
  }

  return null;
};

const Header: React.FC<{ heading: Date | string; className?: ClassOverrides }> = ({
  heading: headingFromProps,
  className,
}) => {
  const heading =
    headingFromProps instanceof Date
      ? `${headingFromProps.getDate()} ${MONTHS[headingFromProps.getMonth()]}`
      : headingFromProps;

  return (
    <div className="flex items-center justify-between w-full">
      <span className={cn('text-xl font-bold')}>{heading}</span>
      <ArrowUpRightIcon
        className={cn('group-hover/event-card:motion-safe:animate-micro-up-right', className?.icon)}
      />
    </div>
  );
};
