'use client';

import Bento from '@/components/Bento';
import { ContactPerson } from '@/components/ContactPerson';
import EventTile from '@/components/EventTile';
import { EventTileData } from '@/components/EventTile/types';
import { GoogleMap } from '@/components/GoogleMap';
import { Hyperlink } from '@/components/Hyperlink';
import ResourceList from '@/components/ResourceList';
import RichText from '@/components/RichText';
import { SubfundPill } from '@/components/SubfundPill';
import TitleTheme from '@/components/TitleTheme';
import { Event } from '@/payload-types';
import { useHeaderTheme } from '@/providers/HeaderTheme';
import { useSubfundTheme } from '@/providers/SubfundTheme';
import { cn } from '@/utilities/cn';
import { ArrowUpRightIcon } from 'lucide-react';
import React, { useEffect } from 'react';

type EventPageClientProps = {
  event: Event;
  related: EventTileData[];
};

const EventPageClient: React.FC<EventPageClientProps> = ({ event, related = [] }) => {
  const { setHeaderTheme } = useHeaderTheme();
  const { setSubfundTheme } = useSubfundTheme();

  useEffect(() => {
    setHeaderTheme('dark'); // Set header theme for event pages
    setSubfundTheme(null); // Set subfund theme for event pages
  }, [setHeaderTheme, setSubfundTheme]);

  return (
    <>
      <EventHeader {...event} />
      <EventDetails {...event} />
      {event.resources && Array.isArray(event.resources) && event.resources.length > 0 && (
        <EventResources {...event} />
      )}
      <EventRelated events={related} />
    </>
  );
};

/**
 * This component renders the header for the event page.
 * It displays the event category, title, and contact person.
 * It also includes a button to add the event to the calendar.
 */
const EventHeader: React.FC<Event> = ({ categories, title, contact }) => {
  return (
    <div className="bg-azure-to-r px-6 py-10">
      <div className="max-w-section mx-auto flex flex-col gap-4 text-foreground-inverted">
        {categories && Array.isArray(categories) && categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              if (
                typeof category !== 'object' ||
                !category ||
                !category.id ||
                !category.slug ||
                !category.name
              ) {
                return null;
              }

              return <SubfundPill key={category.id} theme={category.slug} label={category.name} />;
            })}
          </div>
        )}
        <h2 className="text-3xl font-medium">{title}</h2>
        <div className="flex items-center w-full mt-2">
          {contact && typeof contact === 'object' && <ContactPerson contact={contact} size="sm" />}
          {/*
            TODO: Implement add to calendar functionality
            This button should open a modal or redirect to a calendar integration.
            <ButtonPrime variant="icon" style="flat" color="accent" size="medium" className="ml-auto">
              <CalendarPlusIcon size={24} />
            </ButtonPrime>
          */}
        </div>
      </div>
    </div>
  );
};

/**
 * This component renders the details of the event.
 * It includes the event description, date, time, virtual attendance options, and location.
 * It uses the Bento and Bento.Item components to organize the information.
 * It also formats the date and time for better readability.
 */
const EventDetails: React.FC<Event> = ({
  eventType,
  description,
  startDate,
  endDate,
  startTime,
  endTime,
  registrationTime,
  attendanceOptions,
  virtualProvider,
  virtualLink,
  virtualPasscode,
  location: locationFromProps,
}) => {
  const formattedStartDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(startDate));
  const formattedEndDate = endDate
    ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(
        new Date(endDate),
      )
    : null;

  const formattedStartTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(startTime));
  const formattedEndTime = endTime
    ? new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(
        new Date(endTime),
      )
    : null;
  const formattedRegistrationTime = registrationTime
    ? new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(
        new Date(registrationTime),
      )
    : null;

  const location = typeof locationFromProps === 'object' ? locationFromProps : null;

  return (
    <div className="px-4 pt-8 pb-5">
      <div className="max-w-section mx-auto flex flex-col items-start gap-4">
        <TitleTheme size="responsive" animated={true}>
          Event Details
        </TitleTheme>
        {description && <RichText data={description} enableProse={true} className="mx-0" />}
        <div className="w-full mt-4">
          <Bento>
            {/* Date */}
            <Bento.Item icon="calendar" label="Date" className="lg:col-start-1">
              <span className="text-lg font-medium">{`${formattedStartDate}${formattedEndDate ? ` \u2014 ${formattedEndDate}` : ''}`}</span>
            </Bento.Item>

            {/* Time */}
            <Bento.Item
              icon="clock"
              label="Time"
              className={cn({ 'lg:col-start-1': eventType !== 'importantDate' })}
            >
              <div className="flex flex-col gap-1 text-lg font-medium">
                <span>
                  {`${formattedStartTime}${formattedEndTime ? ` \u2014 ${formattedEndTime}` : ''}`}
                </span>
                {formattedRegistrationTime && (
                  <span className="italic text-foreground-muted">
                    ({formattedRegistrationTime} Registration)
                  </span>
                )}
              </div>
            </Bento.Item>

            {/* Virtual */}
            {eventType !== 'importantDate' && (
              <Bento.Item icon="webcam" label="Virtual Attendance" className="lg:col-start-1">
                {attendanceOptions === 'inPerson' ? (
                  <span className="text-lg font-medium">In-Person Only</span>
                ) : virtualLink ? (
                  <div className="flex flex-col gap-1">
                    <Hyperlink
                      link={{ url: virtualLink, newTab: true, allowReferrer: false }}
                      className="text-lg font-medium"
                    >
                      {virtualProvider ? `${virtualProvider} Meeting Link` : 'Virtual Meeting Link'}{' '}
                      <ArrowUpRightIcon size={16} className="inline-block" />
                    </Hyperlink>
                    {virtualPasscode && (
                      <span className="text-lg text-foreground-muted">
                        Passcode: <strong>{virtualPasscode}</strong>
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-lg font-medium">
                    Virtual Attendance Details Unavailable
                  </span>
                )}
              </Bento.Item>
            )}

            {/* Location */}
            {eventType !== 'importantDate' && (
              <Bento.Item
                icon="map-pin"
                label="Location"
                className="lg:col-start-2 lg:row-start-1 lg:row-span-3"
              >
                {location ? (
                  <div className="flex flex-col gap-1">
                    {location.website ? (
                      <Hyperlink link={location.website} className="text-lg font-medium">
                        {location.name} <ArrowUpRightIcon size={16} className="inline-block" />
                      </Hyperlink>
                    ) : (
                      <span className="text-lg font-medium">{location.name}</span>
                    )}
                    <span className="text-lg text-foreground-muted">
                      {`${location.streetAddress}${location.streetAddress2 ? ` ${location.streetAddress2}` : ''}, ${location.city}, ${location.state} ${location.zipCode}`}
                    </span>
                    <GoogleMap
                      location={location}
                      height={200}
                      containerClassName="rounded-lg overflow-hidden"
                    />
                  </div>
                ) : (
                  <span className="text-lg font-medium">Location Details Unavailable</span>
                )}
              </Bento.Item>
            )}
          </Bento>
        </div>
      </div>
    </div>
  );
};

const EventResources: React.FC<Event> = ({ resources }) => {
  console.log('Event Resources', resources);
  return (
    <div className="px-4 pt-8 pb-5">
      <div className="max-w-section mx-auto flex flex-col items-start gap-4">
        <TitleTheme size="responsive" animated={true}>
          Meeting Resources
        </TitleTheme>
        <ResourceList resources={resources} />
      </div>
    </div>
  );
};

const EventRelated: React.FC<{ events: EventTileData[] }> = ({ events }) => {
  return (
    <div className="px-4 pt-8 pb-12 lg:pb-20">
      <div className="max-w-section mx-auto flex flex-col items-start gap-4">
        <TitleTheme size="responsive" animated={true}>
          Related Events
        </TitleTheme>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {events && events.length > 0 ? (
            events.map((event) => (
              <EventTile
                key={event.id}
                event={event}
                className={cn({
                  'lg:col-span-4': events.length > 1,
                  'lg:col-span-6': events.length === 1,
                })}
              >
                <EventTile.Header />
                <EventTile.Detail />
              </EventTile>
            ))
          ) : (
            <EventTile className="lg:col-span-8">
              <EventTile.NoEvents />
            </EventTile>
          )}
          <EventTile
            event="all"
            className={cn({
              'lg:col-span-4': events.length > 1,
              'lg:col-span-6': events.length === 1,
            })}
          >
            <EventTile.Header />
            <EventTile.Detail />
          </EventTile>
        </div>
      </div>
    </div>
  );
};

export default EventPageClient;
