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
};

export type HeaderCellProps = {
  label: string;
};

export type DateCellProps = {
  label: string;
  isToday: boolean;
  isInMonth: boolean;
  events: Event['eventType'][];
};
