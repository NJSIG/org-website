import { Event } from '@/payload-types';

export type EventsCalendarData = {
  header: string;
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

export type HeaderCellProps = {
  label: { short: string; long: string };
};

export type DateCellProps = {
  srLabel: string;
  label: string;
  isToday: boolean;
  isInMonth: boolean;
  events: Event['eventType'][];
};

export type EventCalendarContextType = {
  filters: Event['eventType'][] | null;
  setFilters: (filters: Event['eventType'] | null) => void;
};
