'use client';

import { cn } from '@/utilities/cn';
import { CalendarDayCell } from './components/CalendarDayCell';
import { CalendarHeader } from './components/CalendarHeader';
import { CalendarHeaderCell } from './components/CalendarHeaderCell';
import { EventsCalendarData } from './types';

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
            <CalendarDayCell key={day.date} {...day} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsCalendar;
