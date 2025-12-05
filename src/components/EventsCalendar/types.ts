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

export type EventsCalendarPicker = Pick<
  EventsCalendarHeader,
  'currentMonth' | 'currentYear' | 'yearRange'
>;

export type EventsCalendarPickerMode = 'month' | 'year';

export type EventsCalendarHeaderCellProps = {
  label: { short: string; long: string };
};

export type EventsCalendarDayCellProps = {
  date: string;
  isToday: boolean;
  isInMonth: boolean;
  events: Event['eventType'][];
};

export type EventCalendarContextType = {
  totalFilters: number;
  filters: Event['eventType'][] | null;
  setFilters: (filters: Event['eventType'] | null) => void;
};
