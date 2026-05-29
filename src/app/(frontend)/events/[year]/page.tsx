import { redirect } from 'next/navigation';

type Args = {
  params: Promise<{ year: string }>;
};

export default async function EventsYearPage({ params: paramsPromise }: Args) {
  const { year } = await paramsPromise;

  // The old website linked to events by ID, we know the old IDs were only 3 digits,
  // so we can just test if the year is 4 digits and redirect if it isn't.
  if (!/^\d{4}$/.test(year)) {
    redirect('/events');
  }

  const date = new Date();

  redirect(`/events/${year}/${(date.getMonth() + 1).toString().padStart(2, '0')}`);
}
