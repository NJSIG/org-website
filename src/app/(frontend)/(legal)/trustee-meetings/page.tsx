import { Temporal } from '@js-temporal/polyfill';
import { redirect } from 'next/navigation';

export default async function TrusteeMeetingsPage() {
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

  redirect(`/trustee-meetings/${temporalStart.year}-${temporalEnd.year}`);
}
