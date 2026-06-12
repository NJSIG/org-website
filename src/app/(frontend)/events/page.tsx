import { redirect } from 'next/navigation';

export default function EventsPage() {
  const date = new Date();

  redirect(`/events/${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}`);
}

// TODO: This whole events chain can probably be simplified using a layout that gets all values
// from the current url and handles redirects in one go as needed. This would allow us to remove
// the pages for everything except the month view and single event view, which would be a lot cleaner.
