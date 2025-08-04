import { EventCardData } from '@/components/EventCard/types';
import { LivePreviewListener } from '@/components/LivePreviewListener';
import { Temporal } from '@js-temporal/polyfill';
import configPromise from '@payload-config';
import { draftMode } from 'next/headers';
import { getPayload } from 'payload';
import { cache } from 'react';
import EventsPageClient from './page.client';

type Args = {
  params: Promise<{ year: string; month: string }>;
};

const queryEventsByYearAndMonth = cache(
  async ({ year, month }: { year: string; month: string }) => {
    if (!year || !month) {
      return null;
    }

    const { isEnabled: draft } = await draftMode();
    const payload = await getPayload({ config: configPromise });

    const startDate = Temporal.PlainDate.from({ year: Number(year), month: Number(month), day: 1 });
    const endDate = startDate.add({ days: startDate.daysInMonth - 1 });

    const result = await payload.find({
      collection: 'events',
      draft,
      pagination: false,
      where: {
        and: [
          {
            startDate: {
              greater_than_equal: startDate.toString(),
              less_than_equal: endDate.toString(),
            },
          },
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
        eventType: true,
        title: true,
        categories: true,
      },
      sort: 'startDate',
    });

    return result.docs || null;
  },
);

const generateCalendarData = (reqYear: string, reqMonth: string, events: EventCardData[]) => {
  const currMonth = Temporal.PlainDate.from({
    year: Number(reqYear),
    month: Number(reqMonth),
    day: 1, // A day is required, so we're just using the first day of the month
  });
  const nextMonth = currMonth.add({ months: 1 });
  const prevMonth = currMonth.subtract({ months: 1 });
  const currMonthStart = currMonth.with({ day: 1 });
  const currMonthStartDow = currMonthStart.dayOfWeek - 1;
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
      events: [
        ...new Set(
          events
            .filter((event) => event.startDate.includes(date.toString()))
            .map((event) => event.eventType),
        ),
      ],
    };
  });

  return {
    header: `${currMonth.toLocaleString('en-US', { month: 'long' })} ${currMonth.year}`,
    nextMonthURL: `/events/${nextMonth.year}/${nextMonth.toLocaleString('en-US', { month: '2-digit' })}`,
    prevMonthURL: `/events/${prevMonth.year}/${prevMonth.toLocaleString('en-US', { month: '2-digit' })}`,
    days,
  };
};

export default async function EventsPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode();
  const { year, month } = await paramsPromise;
  const events = await queryEventsByYearAndMonth({ year, month });

  const calendarData = generateCalendarData(year, month, events || []);

  return (
    <section>
      <EventsPageClient calendarData={calendarData} events={events} />
      {draft && <LivePreviewListener />}
    </section>
  );
}
