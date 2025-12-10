import { EventCardData } from '@/components/EventCard/types';
import { LivePreviewListener } from '@/components/LivePreviewListener';
import { Event } from '@/payload-types';
import { Temporal } from '@js-temporal/polyfill';
import configPromise from '@payload-config';
import { draftMode } from 'next/headers';
import { getPayload } from 'payload';
import { cache } from 'react';
import EventsPageClient from './page.client';

type Args = {
  params: Promise<{ year: string; month: string }>;
};

/**
 * Query events by year and month from Payload CMS. The result includes
 * events for the surrounding days to fill out the calendar grid.
 */
const queryEventsByYearAndMonth = cache(
  async ({ year, month }: { year: string; month: string }) => {
    if (!year || !month) {
      return null;
    }

    const { isEnabled: draft } = await draftMode();
    const payload = await getPayload({ config: configPromise });

    const monthStartDate = Temporal.PlainDate.from({
      year: Number(year),
      month: Number(month),
      day: 1,
    });

    // We start 6 days before the beginning of the month to ensure we capture
    // all events that may appear in the first week of the calendar grid.
    const queryStartDate = monthStartDate.add({ days: -6 });

    // We end 6 days after the end of the month to ensure we capture
    // all events that may appear in the last week of the calendar grid.
    // Note: daysInMonth gives us the length of the month so we only need to add 5 here.
    const queryEndDate = monthStartDate.add({ days: monthStartDate.daysInMonth + 5 });

    const result = await payload.find({
      collection: 'events',
      draft,
      pagination: false,
      where: {
        or: [
          {
            startDate: {
              greater_than_equal: queryStartDate.toString(),
              less_than_equal: queryEndDate.toString(),
            },
          },
          {
            endDate: {
              greater_than_equal: queryStartDate.toString(),
              less_than_equal: queryEndDate.toString(),
            },
          },
        ],
        and: [
          {
            _status: {
              equals: 'published',
            },
          },
        ],
      },
      depth: 1,
      select: {
        id: true,
        slug: true,
        startDate: true,
        startTime: true,
        endDate: true,
        eventType: true,
        title: true,
        categories: true,
      },
      sort: 'startDate',
    });

    return result.docs || null;
  },
);

const generateCalendarData = (reqYear: string, reqMonth: string, events: Event[]) => {
  const currMonth = Temporal.PlainDate.from({
    year: Number(reqYear),
    month: Number(reqMonth),
    day: 1, // A day is required, so we're just using the first day of the month
  });
  const nextMonth = currMonth.add({ months: 1 });
  const prevMonth = currMonth.subtract({ months: 1 });
  const currMonthStart = currMonth.with({ day: 1 });
  const currMonthStartDow = currMonthStart.dayOfWeek;
  const currMonthLength = currMonth.daysInMonth;

  // Calculate overall length of the calendar grid
  // Determine if we need 5 or 6 weeks (35 or 42 days)
  const totalDays = currMonthStartDow + currMonthLength > 35 ? 42 : 35;

  // Generate an array representing each day in the calendar grid
  const days = new Array(totalDays).fill({}).map((_, i) => {
    const date = currMonthStart.add({ days: i - currMonthStartDow });

    return {
      date: date.toString(),
      isInMonth: !(i < currMonthStartDow || i - currMonthStartDow >= currMonthLength),
      isToday: Temporal.Now.plainDateISO().equals(date),
      events: events
        .filter((event) => {
          // We're slicing the dates here to only include the YYYY-MM-DD
          // this will be a problem if we ever move to displaying events
          // in local time for the user.
          const eventStart = Temporal.PlainDate.from(event.startDate.slice(0, 10));
          const eventEnd = event.endDate
            ? Temporal.PlainDate.from(event.endDate.slice(0, 10))
            : eventStart;

          return (
            Temporal.PlainDate.compare(date, eventStart) >= 0 &&
            Temporal.PlainDate.compare(date, eventEnd) <= 0
          );
        })
        .map((event) => ({ id: event.id, eventType: event.eventType })),
    };
  });

  // Be aware of the magic numbers here, 1983 is the date we started operation and will not change
  // 2099 is a very long term end year and likely will never need to be updated.
  return {
    currentMonth: {
      numeric: currMonth.month,
      long: currMonth.toLocaleString('en-US', { month: 'long' }),
    },
    currentYear: currMonth.year,
    yearRange: Array.from({ length: 2100 - 1983 }, (_, i) => 1983 + i),
    nextMonthURL: `/events/${nextMonth.year}/${nextMonth.toLocaleString('en-US', { month: '2-digit' })}`,
    prevMonthURL: `/events/${prevMonth.year}/${prevMonth.toLocaleString('en-US', { month: '2-digit' })}`,
    days,
  };
};

export default async function EventsPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode();
  const { year, month } = await paramsPromise;
  const eventsInCalendarSquare = await queryEventsByYearAndMonth({ year, month });
  const calendarData = generateCalendarData(year, month, eventsInCalendarSquare || []);

  const monthStartDate = Temporal.PlainDate.from({
    year: Number(year),
    month: Number(month),
    day: 1,
  });

  const monthEndDate = monthStartDate.add({ days: monthStartDate.daysInMonth - 1 });

  const eventsInMonth = eventsInCalendarSquare
    ? eventsInCalendarSquare.filter((event) => {
        // We're slicing the dates here to only include the YYYY-MM-DD
        // this will be a problem if we ever move to displaying events
        // in local time for the user.
        const eventStart = Temporal.PlainDate.from(event.startDate.slice(0, 10));
        const eventEnd = event.endDate
          ? Temporal.PlainDate.from(event.endDate.slice(0, 10))
          : eventStart;

        return (
          (Temporal.PlainDate.compare(eventStart, monthStartDate) >= 0 &&
            Temporal.PlainDate.compare(eventStart, monthEndDate) <= 0) ||
          (Temporal.PlainDate.compare(eventEnd, monthStartDate) >= 0 &&
            Temporal.PlainDate.compare(eventEnd, monthEndDate) <= 0)
        );
      })
    : [];

  return (
    <section>
      <EventsPageClient calendarData={calendarData} events={eventsInMonth as EventCardData[]} />
      {draft && <LivePreviewListener />}
    </section>
  );
}
