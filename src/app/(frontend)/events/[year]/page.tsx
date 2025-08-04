import { redirect } from 'next/navigation';

type Args = {
  params: Promise<{ year: string }>;
};

export default async function EventsYearPage({ params: paramsPromise }: Args) {
  const { year } = await paramsPromise;
  const date = new Date();

  redirect(`/events/${year}/${(date.getMonth() + 1).toString().padStart(2, '0')}`);
}
