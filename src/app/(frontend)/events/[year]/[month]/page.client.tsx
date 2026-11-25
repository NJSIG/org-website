'use client';

import EventCard from '@/components/EventCard';
import { EventCardData } from '@/components/EventCard/types';
import EventsCalendar from '@/components/EventsCalendar';
import { EventsCalendarProvider, useEventsCalendar } from '@/components/EventsCalendar/provider';
import { EventsCalendarData } from '@/components/EventsCalendar/types';
import { PageHeader, PageTitle } from '@/components/PageHeader';
import { useHeaderTheme } from '@/providers/HeaderThemeProvider';
import { useEffect } from 'react';

type EventsPageClientProps = {
  calendarData: EventsCalendarData;
  events: EventCardData[] | null;
};

const EventsPageClient: React.FC<EventsPageClientProps> = ({ calendarData, events }) => {
  const { setHeaderTheme } = useHeaderTheme();

  useEffect(() => {
    setHeaderTheme('dark'); // Set header theme for event pages
  }, [setHeaderTheme]);

  return (
    <EventsCalendarProvider>
      <PageHeader>
        <PageTitle>Events Calendar</PageTitle>
      </PageHeader>
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 lg:flex-row lg:gap-16">
        <EventsCalendar {...calendarData} />
        <div className="flex grow flex-col gap-4">
          {/* TODO: Add Event Search */}
          <EventCards events={events} />
          {/* TODO: Event Subscribe Card */}
        </div>
      </div>
    </EventsCalendarProvider>
  );
};

/**
 * The event cards are extracted out locally here so we can include them within the
 * event calendar context for filtering.
 */
const EventCards: React.FC<{ events: EventCardData[] | null }> = ({ events }) => {
  const { filters } = useEventsCalendar();

  // If this filter becomes measurable expensive, we could wrap it in useMemo
  const filteredEvents =
    filters && events ? events.filter((event) => filters.includes(event.eventType)) : events;

  return (
    <>
      {filteredEvents && filteredEvents.length > 0 ? (
        filteredEvents.map((event) => <EventCard key={event.id} event={event} />)
      ) : (
        <div className="bg-njsig-neutral-tint rounded-3xl p-6 text-center">
          <p className="text-njsig-neutral-foreground text-xl">No events to display.</p>
          {events && events.length > 0 && (
            <p className="text-foreground-muted">
              {events.length === 1
                ? 'There is one hidden event.'
                : `There are ${events.length} hidden events.`}
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default EventsPageClient;
