import { buttonVariants } from '@/primitives/ui/button-prime';
import { cn } from '@/utilities/cn';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import { buttonMicroInteractionVariants } from '../Button';
import { DateCellProps, EventsCalendarData, HeaderCellProps } from './types';

const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const EventsCalendar: React.FC<EventsCalendarData> = ({
  header,
  nextMonthURL,
  prevMonthURL,
  days,
}) => {
  const navButtonVariant = buttonVariants({
    variant: 'icon',
    style: 'ghost',
    color: 'primary',
    size: 'medium',
  });

  return (
    <div className="flex flex-col gap-6">
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
          className={cn('grid grid-cols-7 w-[360px]', {
            'grid-rows-6 h-[308px]': days.length <= 35,
            'grid-rows-7 h-[360px]': days.length > 35,
          })}
        >
          {dayLabels.map((label) => (
            <HeaderCell key={label} label={label} />
          ))}
          {days.map((day) => (
            <DateCell
              key={day.date}
              label={new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(
                new Date(day.date),
              )}
              {...day}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const HeaderCell: React.FC<HeaderCellProps> = ({ label }) => {
  return (
    <div className="size-12 flex items-center justify-center p-4">
      <span className="text-lg font-bold text-foreground">{label}</span>
    </div>
  );
};

const DateCell: React.FC<DateCellProps> = ({ label, isToday, isInMonth, events }) => {
  return (
    <div
      className={cn('size-12 flex flex-col items-center justify-center p-4 rounded-lg', {
        'opacity-80': !isInMonth,
        'bg-njsig-tint': isToday,
      })}
    >
      <span
        className={cn('text-lg', {
          'text-foreground font-medium': isInMonth,
          'text-foreground-muted': !isInMonth,
          'font-medium': events.length > 0,
          'font-bold text-njsig-shade': isToday,
        })}
      >
        {label}
      </span>
    </div>
  );
};

export default EventsCalendar;
