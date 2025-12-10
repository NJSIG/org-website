import { Event } from '@/payload-types';
import { createContext, use, useCallback, useState } from 'react';
import { EventsCalendarContextType } from './types';

const initialContext: EventsCalendarContextType = {
  totalFilters: 5,
  filters: ['trusteeMeeting', 'subfundMeeting', 'importantDate', 'njsigEvent', 'otherEvent'],
  setFilters: () => null,
};

const EventsCalendarContext = createContext<EventsCalendarContextType>(initialContext);

export const EventsCalendarProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilterState] = useState<EventsCalendarContextType['filters']>(
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

  return (
    <EventsCalendarContext
      value={{ totalFilters: initialContext.totalFilters, filters, setFilters }}
    >
      {children}
    </EventsCalendarContext>
  );
};

export const useEventsCalendar = (): EventsCalendarContextType => use(EventsCalendarContext);
