import { redirect } from 'next/navigation';

type Args = {
  params: Promise<{ year: string; month: string; day: string }>;
};

export default async function EventsDayPage({ params: paramsPromise }: Args) {
  const { year, month } = await paramsPromise;

  redirect(`/events/${year}/${month}`);
}
