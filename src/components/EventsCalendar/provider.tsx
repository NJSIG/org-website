import { Event } from '@/payload-types';
import { createContext, use, useCallback, useState } from 'react';
import { EventCalendarContextType } from './types';

const initialContext: EventCalendarContextType = {
  filters: ['trusteeMeeting', 'subfundMeeting', 'importantDate'],
  setFilters: () => null,
};

const EventCalendarContext = createContext<EventCalendarContextType>(initialContext);

export const EventCalendarProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilterState] = useState<EventCalendarContextType['filters']>(
    initialContext.filters,
  );

  const setFilters = useCallback(
    (filterToSet: Event['eventType'] | null) => {
      const currentFilters = filters || [];

      // If the filter is already set, remove it
      if (filterToSet && currentFilters.includes(filterToSet)) {
        setFilterState(currentFilters.filter((filter) => filter !== filterToSet));
        return;
      }

      // If the filter is not set, add it
      if (filterToSet && !currentFilters.includes(filterToSet)) {
        setFilterState([...currentFilters, filterToSet]);
        return;
      }

      // If no filter is provided, clear all filters
      if (!filterToSet) {
        setFilterState([]);
      }
    },
    [filters],
  );

  return <EventCalendarContext value={{ filters, setFilters }}>{children}</EventCalendarContext>;
};

export const useEventCalendar = (): EventCalendarContextType => use(EventCalendarContext);
