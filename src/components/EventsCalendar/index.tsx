'use client';

import { buttonVariants } from '@/primitives/ui/button-prime';
import { cn } from '@/utilities/cn';
import { Temporal } from '@js-temporal/polyfill';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import { buttonMicroInteractionVariants } from '../Button';
import { useEventCalendar } from './provider';
import { DateCellProps, EventsCalendarData, HeaderCellProps } from './types';

const dayLabels = [
  { short: 'Su', long: 'Sunday' },
  { short: 'Mo', long: 'Monday' },
  { short: 'Tu', long: 'Tuesday' },
  { short: 'We', long: 'Wednesday' },
  { short: 'Th', long: 'Thursday' },
  { short: 'Fr', long: 'Friday' },
  { short: 'Sa', long: 'Saturday' },
];

const navButtonVariant = buttonVariants({
  variant: 'icon',
  style: 'ghost',
  color: 'primary',
  size: 'medium',
});

const EventsCalendar: React.FC<EventsCalendarData> = ({
  header,
  nextMonthURL,
  prevMonthURL,
  days,
  allowFiltering = true,
}) => {
  return (
    <div className="flex flex-col gap-6 max-w-[360px] mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Link
            href={prevMonthURL}
            aria-label="Previous Month"
            className={cn(
              navButtonVariant,
              buttonMicroInteractionVariants({ animation: 'bounceLeft' }),
            )}
          >
            <ChevronLeftIcon size={24} />
          </Link>
          <h3 className="text-xl font-medium text-foreground">{header}</h3>
          <Link
            href={nextMonthURL}
            aria-label="Next Month"
            className={cn(
              navButtonVariant,
              buttonMicroInteractionVariants({ animation: 'bounceRight' }),
            )}
          >
            <ChevronRightIcon size={24} />
          </Link>
        </div>
        <div
          className={cn('grid grid-cols-7 w-full gap-1', {
            'grid-rows-6 h-[308px]': days.length <= 35,
            'grid-rows-7 h-[360px]': days.length > 35,
          })}
        >
          {dayLabels.map((label) => (
            <HeaderCell key={label.short} label={label} />
          ))}
          {days.map((day) => (
            <DateCell
              key={day.date}
              srLabel={Temporal.PlainDate.from(day.date).toLocaleString('en-US', {
                month: 'long',
                day: '2-digit',
                weekday: 'long',
              })}
              label={Temporal.PlainDate.from(day.date).toLocaleString('en-US', { day: '2-digit' })}
              {...day}
            />
          ))}
        </div>
      </div>
      {allowFiltering && <CalendarFilters />}
    </div>
  );
};

const HeaderCell: React.FC<HeaderCellProps> = ({ label }) => {
  return (
    <div className="h-12 max-w-12 flex items-center justify-center p-2" aria-label={label.long}>
      <span className="text-lg font-bold text-foreground">{label.short}</span>
    </div>
  );
};

const DateCell: React.FC<DateCellProps> = ({ srLabel, label, isToday, isInMonth, events }) => {
  const { filters } = useEventCalendar();

  const ariaLabel =
    events.length > 0
      ? `${srLabel} with ${events.length} event${events.length > 1 ? 's' : ''}`
      : srLabel;

  return (
    <div
      aria-label={ariaLabel}
      aria-hidden={!isInMonth || !events.length}
      className={cn('h-12 max-w-12 flex flex-col items-center justify-center rounded-lg p-2', {
        'opacity-80': !isInMonth,
        'bg-njsig-tint': isToday,
      })}
    >
      <span
        className={cn('text-lg', {
          'text-foreground': isInMonth,
          'text-foreground-muted text-light': !isInMonth,
          'font-bold': events.length > 0 || isToday,
          'text-njsig-shade': isToday,
        })}
      >
        {label}
      </span>
      <div className="flex gap-1 px-0.5 items-center mx-auto">
        {events.map((event) => (
          <span
            key={event}
            className={cn('rounded-full size-1.5 border-1', {
              'border-[var(--event-theme-trustee-accent)]': event === 'trusteeMeeting',
              'bg-[var(--event-theme-trustee-accent)]':
                event === 'trusteeMeeting' && filters?.includes('trusteeMeeting'),
              'border-[var(--event-theme-subfund-accent)]': event === 'subfundMeeting',
              'bg-[var(--event-theme-subfund-accent)]':
                event === 'subfundMeeting' && filters?.includes('subfundMeeting'),
              'border-[var(--event-theme-important-accent)]': event === 'importantDate',
              'bg-[var(--event-theme-important-accent)]':
                event === 'importantDate' && filters?.includes('importantDate'),
            })}
          ></span>
        ))}
      </div>
    </div>
  );
};

const CalendarFilters: React.FC = () => {
  const { filters, setFilters } = useEventCalendar();
  const buttonClasses = cn(
    buttonVariants({ variant: 'button', size: 'medium', style: 'ghost' }),
    'flex gap-4 justify-start',
  );

  return (
    <div className="flex flex-col gap-4 px-1 items-start">
      <h4 className="text-xl font-medium">Event Filters</h4>
      <label className={buttonClasses}>
        <input
          className="appearance-none size-2 rounded-full border-1 border-[var(--event-theme-trustee-accent)] checked:bg-[var(--event-theme-trustee-accent)]"
          aria-label={
            filters?.includes('trusteeMeeting')
              ? 'Hide Board of Trustees Meetings'
              : 'Show Board of Trustees Meetings'
          }
          type="checkbox"
          name="trusteeMeeting"
          checked={filters?.includes('trusteeMeeting')}
          onChange={() => setFilters('trusteeMeeting')}
        />
        <span>Board of Trustees Meetings</span>
      </label>
      <label className={cn(buttonClasses)}>
        <input
          className="appearance-none size-2 rounded-full border-1 border-[var(--event-theme-subfund-accent)] checked:bg-[var(--event-theme-subfund-accent)]"
          aria-label={
            filters?.includes('subfundMeeting')
              ? 'Hide Sub-fund Meetings'
              : 'Show Sub-fund Meetings'
          }
          type="checkbox"
          name="subfundMeeting"
          checked={filters?.includes('subfundMeeting')}
          onChange={() => setFilters('subfundMeeting')}
        />
        <span>Sub-fund Meetings</span>
      </label>
      <label className={cn(buttonClasses)}>
        <input
          className="appearance-none size-2 rounded-full border-1 border-[var(--event-theme-important-accent)] checked:bg-[var(--event-theme-important-accent)]"
          aria-label={
            filters?.includes('importantDate') ? 'Hide Important Dates' : 'Show Important Dates'
          }
          type="checkbox"
          name="importantDate"
          checked={filters?.includes('importantDate')}
          onChange={() => setFilters('importantDate')}
        />
        <span>Important Dates</span>
      </label>
    </div>
  );
};

export default EventsCalendar;
