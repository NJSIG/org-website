import { cn } from '@/utilities/cn';
import { Temporal } from '@js-temporal/polyfill';
import { useEventCalendar } from '../../provider';
import { EventsCalendarDayCellProps } from '../../types';

export const CalendarDayCell: React.FC<EventsCalendarDayCellProps> = ({
  date,
  isToday,
  isInMonth,
  events,
}) => {
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
      className={cn(
        'h-20 max-w-16 flex flex-col items-center justify-start rounded-lg px-2 py-4 border-2 border-transparent',
        {
          'border-njsig-primary bg-njsig-background': isToday,
          'bg-njsig-neutral-tint': !isInMonth,
        },
      )}
    >
      <span
        className={cn('text-lg', {
          'text-foreground font-medium': isInMonth,
          'text-foreground-muted': !isInMonth,
          'font-semibold': events.length > 0,
          'font-extrabold': isToday,
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
