import { LivePreviewListener } from '@/components/LivePreviewListener';
import { Temporal } from '@js-temporal/polyfill';
import configPromise from '@payload-config';
import { unstable_cache } from 'next/cache';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPayload } from 'payload';
import { cache } from 'react';
import TrusteeMeetingsPageClient from './page.client';

type Args = {
  params: Promise<{ programYear: string }>;
};

// Find all the distinct years that have trustee meetings. we don't need all the details, just the start date
// to determine which program years to show in the dropdown on the frontend
const queryYearsWithTrusteeMeetings = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise });

    const result = await payload.findDistinct({
      collection: 'events',
      field: 'startDate',
      where: {
        and: [
          {
            eventType: {
              equals: 'trusteeMeeting',
            },
          },
          {
            _status: {
              equals: 'published',
            },
          },
        ],
      },
    });

    // Transform the list of dates to a list of program years. For example, a date of 2025-03-01 would
    // be transformed to a program year of 2024-2025, but a date of 2025-08-01 would be transformed to
    // a program year of 2025-2026.
    //
    // We're slicing the start date here to only include the YYYY-MM-DD this will be a problem if we ever
    // move to displaying events in local time for the user.
    const programYears = result.values.reduce((acc: string[], meeting) => {
      const meetingDate = Temporal.PlainDate.from(meeting.startDate.slice(0, 10));
      const year = meetingDate.year;

      let programYearStart;
      let programYearEnd;

      if (meetingDate.month >= 7) {
        programYearStart = year;
        programYearEnd = year + 1;
      } else {
        programYearStart = year - 1;
        programYearEnd = year;
      }

      const programYearId = `${programYearStart}-${programYearEnd}`;

      // Only add the program year to the list if it isn't already in there
      if (!acc.includes(programYearId)) {
        acc.push(programYearId);
      }

      return acc;
    }, []);

    programYears.sort((a, b) => b.localeCompare(a));
    return programYears;
  },
  ['trustee-meeting-program-years'],
  { tags: ['events'] },
);

const queryTrusteeMeetingsForYear = cache(
  async ({ start, end, draft }: { start: string; end: string; draft: boolean }) => {
    const payload = await getPayload({ config: configPromise });

    const result = await payload.find({
      collection: 'events',
      draft,
      pagination: false,
      where: {
        and: [
          {
            eventType: {
              equals: 'trusteeMeeting',
            },
          },
          {
            startDate: {
              greater_than_equal: start,
              less_than_equal: end,
            },
          },
          {
            _status: {
              equals: 'published',
            },
          },
        ],
      },
      select: {
        id: true,
        slug: true,
        startDate: true,
        eventType: true,
        title: true,
        trusteeMeetingAgenda: true,
        trusteeMeetingMinutes: true,
      },
      sort: '-startDate',
    });

    return result.docs || null;
  },
);

const queryPublishedTrusteeMeetingsForYear = unstable_cache(
  async ({ start, end }: { start: string; end: string }) => {
    return queryTrusteeMeetingsForYear({ start, end, draft: false });
  },
  ['trustee-meetings-by-program-year'],
  { tags: ['events'] },
);

export default async function TrusteeMeetingsPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode();
  const { programYear: programYearFromProps } = await paramsPromise;

  let programYear = programYearFromProps;
  let start;
  let end;

  // If the program year isn't provided or is invalid, we need to find the current date
  // and get the start (7/1) and end (6/30) of the current program year, then redirect to that URL.
  // Redirecting ensures there is always a valid program year in the URL.
  if (/^\d{4}-\d{4}$/.test(programYearFromProps)) {
    const [startYear, endYear] = programYearFromProps.split('-').map(Number);
    start = Temporal.PlainDate.from({ year: startYear, month: 7, day: 1 }).toString();
    end = Temporal.PlainDate.from({ year: endYear, month: 6, day: 30 }).toString();
  } else {
    const today = Temporal.Now.plainDateTimeISO();

    let temporalStart;
    let temporalEnd;

    if (today.month >= 7) {
      temporalStart = Temporal.PlainDate.from({ year: today.year, month: 7, day: 1 });
      temporalEnd = Temporal.PlainDate.from({ year: today.year + 1, month: 6, day: 30 });
    } else {
      temporalStart = Temporal.PlainDate.from({ year: today.year - 1, month: 7, day: 1 });
      temporalEnd = Temporal.PlainDate.from({ year: today.year, month: 6, day: 30 });
    }

    programYear = `${temporalStart.year}-${temporalEnd.year}`;

    redirect(`/trustee-meetings/${programYear}`);
  }

  const yearsWithTrusteeMeetings = await queryYearsWithTrusteeMeetings();
  const trusteeMeetingsForYear = draft
    ? await queryTrusteeMeetingsForYear({ start, end, draft: true })
    : await queryPublishedTrusteeMeetingsForYear({ start, end });

  return (
    <section>
      <TrusteeMeetingsPageClient
        currentYear={programYear}
        programYears={yearsWithTrusteeMeetings}
        meetings={trusteeMeetingsForYear}
      />
      {draft && <LivePreviewListener />}
    </section>
  );
}
