import { redirect } from 'next/navigation';

export default function EventsPage() {
  const date = new Date();

  redirect(`/events/${date.getFullYear()}/${date.getMonth() + 1}`);
}
