import { Button, buttonVariants } from '@/primitives/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/primitives/ui/popover';
import { ScrollArea } from '@/primitives/ui/scroll-area';
import { cn } from '@/utilities/cn';
import { CalendarFold, ChevronLeftIcon, ChevronRightIcon, FilterIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useEventCalendar } from '../../provider';
import { EventsCalendarHeader, EventsCalendarPicker } from '../../types';

const navButtonVariant = buttonVariants({
  variant: 'icon',
  style: 'ghost',
  color: 'primary',
  size: 'medium',
});

export const CalendarHeader: React.FC<EventsCalendarHeader> = ({
  currentMonth,
  currentYear,
  yearRange,
  nextMonthURL,
  prevMonthURL,
  allowFiltering,
}) => {
  return (
    <div className="flex gap-2 items-center">
      <Link
        href={prevMonthURL}
        aria-label="Previous Month"
        className={cn(buttonVariants({ animation: 'bounceLeft' }), navButtonVariant)}
      >
        <ChevronLeftIcon size={24} />
      </Link>
      <CalendarPicker currentMonth={currentMonth} currentYear={currentYear} yearRange={yearRange} />
      {allowFiltering && <CalendarFilters />}
      <Link
        href={nextMonthURL}
        aria-label="Next Month"
        className={cn(buttonVariants({ animation: 'bounceRight' }), navButtonVariant)}
      >
        <ChevronRightIcon size={24} />
      </Link>
    </div>
  );
};

const CalendarPicker: React.FC<EventsCalendarPicker> = ({
  currentMonth,
  currentYear,
  yearRange,
}) => {
  const router = useRouter();
  const MONTHS: { long: string; short: string; numeric: string }[] = [
    { long: 'January', short: 'JAN', numeric: '01' },
    { long: 'February', short: 'FEB', numeric: '02' },
    { long: 'March', short: 'MAR', numeric: '03' },
    { long: 'April', short: 'APR', numeric: '04' },
    { long: 'May', short: 'MAY', numeric: '05' },
    { long: 'June', short: 'JUN', numeric: '06' },
    { long: 'July', short: 'JUL', numeric: '07' },
    { long: 'August', short: 'AUG', numeric: '08' },
    { long: 'September', short: 'SEP', numeric: '09' },
    { long: 'October', short: 'OCT', numeric: '10' },
    { long: 'November', short: 'NOV', numeric: '11' },
    { long: 'December', short: 'DEC', numeric: '12' },
  ];

  const [showYearPicker, setShowYearPicker] = useState(false);
  const selectedMonthRef = useRef<string>(currentMonth.numeric.toString().padStart(2, '0'));
  const selectedYearRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (showYearPicker && selectedYearRef.current) {
      selectedYearRef.current.scrollIntoView({ block: 'start' });
    }
  }, [showYearPicker]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setShowYearPicker(false);
    }
  };

  const handleMonthPick = (month: string) => {
    selectedMonthRef.current = month;
    setShowYearPicker(true);
  };

  const handleYearPick = (year: number) => {
    router.push(`/events/${year}/${selectedMonthRef.current}`);
  };

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger
        className={cn(buttonVariants({ animation: 'bounceDown' }), navButtonVariant, 'grow')}
      >
        <CalendarFold size={24} />
        <h3 className="text-xl font-medium text-center text-foreground">
          {currentMonth.long} {currentYear}
        </h3>
      </PopoverTrigger>
      <PopoverContent className="w-80" collisionPadding={16}>
        <div className="grid gap-4 mb-2">
          {/* Month Select */}
          {!showYearPicker && (
            <div className="grid gap-2 grid-cols-3">
              {MONTHS.map((month) => (
                <Button
                  type="button"
                  style="ghost"
                  key={month.numeric}
                  className={cn('border border-transparent', {
                    'border-njsig-neutral-midtone bg-njsig-neutral-tint':
                      month.numeric === selectedMonthRef.current,
                  })}
                  onClick={() => handleMonthPick(month.numeric)}
                  aria-label={month.long}
                >
                  {month.short}
                </Button>
              ))}
            </div>
          )}
          {/* Year Select */}
          {showYearPicker && (
            <ScrollArea type="always" className="h-[184px]">
              <div className="grid gap-2 grid-cols-3">
                {yearRange.map((year) => (
                  <Button
                    type="button"
                    style="ghost"
                    key={year}
                    ref={year === currentYear ? selectedYearRef : null}
                    className={cn('border border-transparent', {
                      'border-njsig-neutral-midtone bg-njsig-neutral-tint': year === currentYear,
                    })}
                    onClick={() => handleYearPick(year)}
                  >
                    <time dateTime={year.toString()}>{year}</time>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const CalendarFilters: React.FC = () => {
  const { totalFilters, filters, setFilters } = useEventCalendar();
  const filterButtonVariant = cn(
    buttonVariants({ variant: 'button', size: 'medium', style: 'ghost' }),
    'flex gap-4 justify-start',
  );

  return (
    <Popover>
      <PopoverTrigger className={cn(buttonVariants({ animation: 'bounceDown' }), navButtonVariant)}>
        <FilterIcon
          size={24}
          className={cn({ 'fill-foreground/40': filters && filters?.length < totalFilters })}
        />
      </PopoverTrigger>
      <PopoverContent className="w-80" collisionPadding={16}>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Filters</h4>
            <p className="text-muted-foreground text-sm">Show and hide events by type.</p>
          </div>
          <div className="grid gap-2">
            {/* Trustee Meetings */}
            <label
              className={cn(filterButtonVariant, 'event-theme-trustee cursor-pointer', {
                'bg-(--event-theme-background)': filters?.includes('trusteeMeeting'),
              })}
            >
              <input
                className="appearance-none size-3 rounded-sm border-2 border-(--event-theme-accent) checked:bg-(--event-theme-accent)"
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
            {/* Sub-fund Meetings */}
            <label
              className={cn(filterButtonVariant, 'event-theme-subfund cursor-pointer', {
                'bg-(--event-theme-background)': filters?.includes('subfundMeeting'),
              })}
            >
              <input
                className="appearance-none size-3 rounded-sm border-2 border-(--event-theme-accent) checked:bg-(--event-theme-accent)"
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
            {/* NJSIG Events */}
            <label
              className={cn(filterButtonVariant, 'event-theme-njsig cursor-pointer', {
                'bg-(--event-theme-background)': filters?.includes('njsigEvent'),
              })}
            >
              <input
                className="appearance-none size-3 rounded-sm border-2 border-(--event-theme-accent) checked:bg-(--event-theme-accent)"
                aria-label={
                  filters?.includes('njsigEvent') ? 'Hide NJSIG Events' : 'Show NJSIG Events'
                }
                type="checkbox"
                name="njsigEvent"
                checked={filters?.includes('njsigEvent')}
                onChange={() => setFilters('njsigEvent')}
              />
              <span>NJSIG Events</span>
            </label>
            {/* Other Events */}
            <label
              className={cn(filterButtonVariant, 'event-theme-other cursor-pointer', {
                'bg-(--event-theme-background)': filters?.includes('otherEvent'),
              })}
            >
              <input
                className="appearance-none size-3 rounded-sm border-2 border-(--event-theme-accent) checked:bg-(--event-theme-accent)"
                aria-label={
                  filters?.includes('otherEvent') ? 'Hide Other Events' : 'Show Other Events'
                }
                type="checkbox"
                name="otherEvent"
                checked={filters?.includes('otherEvent')}
                onChange={() => setFilters('otherEvent')}
              />
              <span>Other Events</span>
            </label>
            {/* Important Dates */}
            <label
              className={cn(filterButtonVariant, 'event-theme-important cursor-pointer', {
                'bg-(--event-theme-background)': filters?.includes('importantDate'),
              })}
            >
              <input
                className="appearance-none size-3 rounded-sm border-2 border-(--event-theme-accent) checked:bg-(--event-theme-accent)"
                aria-label={
                  filters?.includes('importantDate')
                    ? 'Hide Important Dates'
                    : 'Show Important Dates'
                }
                type="checkbox"
                name="importantDate"
                checked={filters?.includes('importantDate')}
                onChange={() => setFilters('importantDate')}
              />
              <span>Important Dates</span>
            </label>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
