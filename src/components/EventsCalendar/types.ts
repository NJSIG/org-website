import { Event } from '@/payload-types';

export type EventsCalendarData = {
  currentMonth: {
    numeric: number;
    long: string;
  };
  currentYear: number;
  yearRange: number[];
  nextMonthURL: string;
  prevMonthURL: string;
  days: {
    date: string;
    isInMonth: boolean;
    isToday: boolean;
    events: Event['eventType'][];
  }[];
  allowFiltering?: boolean;
};

export type EventsCalendarHeader = Pick<
  EventsCalendarData,
  'currentMonth' | 'currentYear' | 'yearRange' | 'nextMonthURL' | 'prevMonthURL' | 'allowFiltering'
>;

export type HeaderCellProps = {
  label: { short: string; long: string };
};

export type DateCellProps = {
  date: string;
  isToday: boolean;
  isInMonth: boolean;
  events: Event['eventType'][];
};

export type EventCalendarContextType = {
  filters: Event['eventType'][] | null;
  setFilters: (filters: Event['eventType'] | null) => void;
};
