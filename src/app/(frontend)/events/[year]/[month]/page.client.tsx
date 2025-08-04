'use client';

import { EventCardData } from '@/components/EventCard/types';
import EventsCalendar from '@/components/EventsCalendar';
import { EventsCalendarData } from '@/components/EventsCalendar/types';
import { useHeaderTheme } from '@/providers/HeaderTheme';
import { useSubfundTheme } from '@/providers/SubfundTheme';
import { useEffect } from 'react';

type EventsPageClientProps = {
  calendarData: EventsCalendarData;
  events: EventCardData[] | null;
};

const EventsPageClient: React.FC<EventsPageClientProps> = ({ calendarData, events }) => {
  const { setHeaderTheme } = useHeaderTheme();
  const { setSubfundTheme } = useSubfundTheme();

  useEffect(() => {
    setHeaderTheme('dark'); // Set header theme for event pages
    setSubfundTheme(null); // Set subfund theme for event pages
  }, [setHeaderTheme, setSubfundTheme]);

  console.log('Calendar', calendarData);
  console.log('Events', events);

  return (
    <>
      <div className="bg-azure-to-r px-6 py-10">
        <div className="max-w-section mx-auto flex flex-col gap-4 text-foreground-inverted">
          <h2 className="text-3xl font-medium">Events Calendar</h2>
        </div>
      </div>
      <div className="px-4 pt-8 pb-12 flex flex-col gap-8 lg:flex-row max-w-section">
        <EventsCalendar {...calendarData} />
      </div>
    </>
  );
};

export default EventsPageClient;
