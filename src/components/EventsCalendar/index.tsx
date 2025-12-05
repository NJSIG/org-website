'use client';

import { cn } from '@/utilities/cn';
import { Temporal } from '@js-temporal/polyfill';
import { CalendarHeader } from './components/CalendarHeader';
import { CalendarHeaderCell } from './components/CalendarHeaderCell';
import { useEventCalendar } from './provider';
import { DateCellProps, EventsCalendarData } from './types';

const dayLabels = [
  { short: 'Su', long: 'Sunday' },
  { short: 'Mo', long: 'Monday' },
  { short: 'Tu', long: 'Tuesday' },
  { short: 'We', long: 'Wednesday' },
  { short: 'Th', long: 'Thursday' },
  { short: 'Fr', long: 'Friday' },
  { short: 'Sa', long: 'Saturday' },
];

const EventsCalendar: React.FC<EventsCalendarData> = ({
  currentMonth,
  currentYear,
  yearRange,
  nextMonthURL,
  prevMonthURL,
  days,
  allowFiltering = true,
}) => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[480px] mx-auto">
      <div className="flex flex-col gap-4">
        <CalendarHeader
          currentMonth={currentMonth}
          currentYear={currentYear}
          yearRange={yearRange}
          nextMonthURL={nextMonthURL}
          prevMonthURL={prevMonthURL}
          allowFiltering={allowFiltering}
        />
        <div
          className={cn('grid grid-cols-7 gap-1', {
            'grid-rows-6 h-[464px]': days.length <= 35,
            'grid-rows-7 h-[544px]': days.length > 35,
          })}
        >
          {dayLabels.map((label) => (
            <CalendarHeaderCell key={label.short} label={label} />
          ))}
          {days.map((day) => (
            <DateCell key={day.date} {...day} />
          ))}
        </div>
      </div>
    </div>
  );
};

const DateCell: React.FC<DateCellProps> = ({ date, isToday, isInMonth, events }) => {
  const { filters } = useEventCalendar();
  const label = Temporal.PlainDate.from(date).toLocaleString('en-US', { day: '2-digit' });
  const srLabel = Temporal.PlainDate.from(date).toLocaleString('en-US', {
    month: 'long',
    day: '2-digit',
    weekday: 'long',
  });

  const ariaLabel =
    events.length > 0
      ? `${srLabel} with ${events.length} event${events.length > 1 ? 's' : ''}`
      : srLabel;

  return (
    <div
      aria-label={ariaLabel}
      aria-hidden={!isInMonth || !events.length}
      className={cn('h-20 max-w-16 flex flex-col items-center justify-center rounded-lg p-2', {
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
        <time dateTime={date}>{label}</time>
      </span>
      <div className="flex gap-1 px-0.5 items-center mx-auto">
        {events.map((event) => (
          <span
            key={event}
            className={cn('rounded-full size-1.5 border', {
              'border-(--event-theme-trustee-accent)': event === 'trusteeMeeting',
              'bg-(--event-theme-trustee-accent)':
                event === 'trusteeMeeting' && filters?.includes('trusteeMeeting'),
              'border-(--event-theme-subfund-accent)': event === 'subfundMeeting',
              'bg-(--event-theme-subfund-accent)':
                event === 'subfundMeeting' && filters?.includes('subfundMeeting'),
              'border-(--event-theme-important-accent)': event === 'importantDate',
              'bg-(--event-theme-important-accent)':
                event === 'importantDate' && filters?.includes('importantDate'),
            })}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default EventsCalendar;
