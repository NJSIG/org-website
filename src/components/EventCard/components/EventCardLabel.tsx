'use client';

import { useHasHydrated } from '@/components/hooks/useHasHydrated';
import { ArrowUpRightIcon } from 'lucide-react';

export const EventCardLabel: React.FC<{
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
