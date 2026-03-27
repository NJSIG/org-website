import { cn } from '@/utilities/cn';
import { Temporal } from '@js-temporal/polyfill';
import { useEventsCalendar } from '../../provider';
import { EventsCalendarContextType, EventsCalendarDayCellProps } from '../../types';

export const CalendarDayCell: React.FC<EventsCalendarDayCellProps> = ({
  date,
  isToday,
  isInMonth,
  events,
}) => {
  const { filters } = useEventsCalendar();
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
      aria-hidden={!isInMonth}
      className={cn('h-20 max-w-16 flex flex-col items-center justify-start rounded-lg px-2 py-4', {
        'bg-njsig-neutral-tint': !isInMonth,
      })}
    >
      <span
        className={cn('text-lg font-medium rounded-lg size-8 flex items-center justify-center', {
          'text-foreground': isInMonth,
          'text-foreground-muted font-light': !isInMonth,
          'bg-njsig-shade text-foreground-inverted font-semibold': isToday,
        })}
      >
        <time dateTime={date}>{label}</time>
      </span>
      <CalendarEventMarkers events={events} isInMonth={isInMonth} filters={filters} />
    </div>
  );
};

const CalendarEventMarkers: React.FC<
  Pick<EventsCalendarDayCellProps, 'events' | 'isInMonth'> &
    Pick<EventsCalendarContextType, 'filters'>
> = ({ events, isInMonth, filters }) => {
  if (events.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-center px-0.5 w-full h-full">
      {events.map((event) => (
        <span
          key={event.id}
          aria-label={getAriaLabelForEventType(event.eventType)}
          className={cn(
            'event-theme',
            {
              'event-theme-trustee': event.eventType === 'trusteeMeeting',
              'event-theme-subfund': event.eventType === 'subfundMeeting',
              'event-theme-njsig': event.eventType === 'njsigEvent',
              'event-theme-other': event.eventType === 'otherEvent',
              'event-theme-important': event.eventType === 'importantDate',
            },
            'grow h-2 max-w-3 first:rounded-l-sm last:rounded-r-sm bg-(--event-theme-accent)/30',
            {
              'bg-(--event-theme-accent)': filters?.includes(event.eventType) && isInMonth,
            },
          )}
        ></span>
      ))}
    </div>
  );
};

const getAriaLabelForEventType = (
  eventType: EventsCalendarDayCellProps['events'][number]['eventType'],
) => {
  switch (eventType) {
    case 'trusteeMeeting':
      return 'Trustee Meeting';
    case 'subfundMeeting':
      return 'Sub-fund Meeting';
    case 'njsigEvent':
      return 'NJSIG Event';
    case 'otherEvent':
      return 'Other Event';
    case 'importantDate':
      return 'Important Date';
    default:
      return 'Unknown Event';
  }
};
