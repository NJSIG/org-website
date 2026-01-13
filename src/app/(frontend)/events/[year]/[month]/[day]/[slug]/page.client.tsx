'use client';

import Bento from '@/components/Bento';
import { ContactPerson } from '@/components/ContactPerson';
import { EventCardType } from '@/components/EventCard';
import {
  EventTile,
  EventTileDetail,
  EventTileHeader,
  EventTileNoEvents,
} from '@/components/EventTile';
import { EventTileData } from '@/components/EventTile/types';
import { GoogleMap } from '@/components/GoogleMap';
import { Hyperlink } from '@/components/Hyperlink';
import { PageHeader, PageTitle } from '@/components/PageHeader';
import ResourceList from '@/components/ResourceList';
import RichText from '@/components/RichText';
import { SubfundPill } from '@/components/SubfundPill';
import TitleTheme from '@/components/TitleTheme';
import { Event } from '@/payload-types';
import { useHeaderTheme } from '@/providers/HeaderTheme';
import { cn } from '@/utilities/cn';
import { ArrowUpRightIcon, MapPinXIcon } from 'lucide-react';
import React, { useEffect } from 'react';

type EventPageClientProps = {
  event: Event;
  related: EventTileData[];
};

const EventPageClient: React.FC<EventPageClientProps> = ({ event, related = [] }) => {
  const { setHeaderTheme } = useHeaderTheme();

  useEffect(() => {
    setHeaderTheme('dark'); // Set header theme for event pages
  }, [setHeaderTheme]);

  return (
    <>
      <EventHeader {...event} />
      <EventDetails {...event} />
      {event.resources && Array.isArray(event.resources) && event.resources.length > 0 && (
        <EventResources {...event} />
      )}
      <EventRelated animateSectionTitle={!event.description && !event.resources} events={related} />
    </>
  );
};

/**
 * This component renders the header for the event page.
 * It displays the event dates, title, event type, and associated categories.
 * A placeholder is included for potential "add to calendar" functionality.
 */
const EventHeader: React.FC<Event> = ({
  eventType,
  important,
  categories,
  title,
  startDate: startDateFromProps,
  endDate: endDateFromProps,
}) => {
  const startDate = new Date(startDateFromProps);
  const endDate = endDateFromProps ? new Date(endDateFromProps) : undefined;

  const formattedStartMonth = new Intl.DateTimeFormat('en-US', { month: 'short' })
    .format(startDate)
    .toUpperCase();

  const formattedStartDay = new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(startDate);

  const formattedEndMonth = endDate
    ? new Intl.DateTimeFormat('en-US', { month: 'short' }).format(endDate).toUpperCase()
    : undefined;

  const formattedEndDay = endDate
    ? new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(endDate)
    : undefined;

  return (
    <PageHeader
      inner={{ className: 'gap-1' }}
      className="text-foreground bg-(--event-theme-background)"
    >
      <small className="text-(--event-theme-shade) text-sm font-semibold">
        <time dateTime={startDateFromProps}>
          {formattedStartMonth} {formattedStartDay}
        </time>
        {endDateFromProps && (
          <>
            {' - '}
            <time dateTime={endDateFromProps}>
              {formattedEndMonth !== formattedStartMonth ? formattedEndMonth : ''} {formattedEndDay}
            </time>
          </>
        )}
      </small>
      <div className="flex items-center justify-between mb-2">
        <PageTitle>{title}</PageTitle>
        {/* TODO: Implement add to calendar function */}
      </div>
      <div className="flex items-center justify-between gap-4">
        <EventCardType
          eventType={eventType}
          important={important}
          iconSize={16}
          className="text-base"
        />
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
      </div>
    </PageHeader>
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
  presenter,
  credits,
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
  contact,
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
      <div className="max-w-7xl mx-auto flex flex-col items-start gap-4">
        <TitleTheme size="responsive" animated={false}>
          Event Details
        </TitleTheme>
        <div className="w-full">
          {(description || (presenter && presenter !== '') || (credits && credits !== '')) && (
            <Bento
              className={cn('auto-rows-min', {
                // With Description
                "[grid-template-areas:'description'_'presenter'_'credits'] lg:[grid-template-areas:'description_description_presenter'_'description_description_credits']":
                  description,
                // Without Description
                "[grid-template-areas:'presenter'_'credits'] lg:[grid-template-areas:'presenter_credits']":
                  !description,
                // With Description and no Presenter or Credits
                "[grid-template-areas:'description'] lg:[grid-template-areas:'description_description_placeholder']":
                  !presenter && !credits,
              })}
            >
              {/* Description */}
              {description && (
                <Bento.Item
                  icon="book-open-text"
                  label="Description"
                  className="[grid-area:description]"
                >
                  <RichText data={description} className="mx-0" />
                </Bento.Item>
              )}

              {/* Details Or Placeholder */}
              {(presenter && presenter !== '') || (credits && credits !== '') ? (
                <>
                  {/* Presenter */}
                  {presenter && presenter !== '' ? (
                    <Bento.Item
                      icon="megaphone"
                      label="Presenter"
                      className="[grid-area:presenter] flex flex-col"
                    >
                      <div className="flex flex-col gap-1 grow justify-center font-medium text-[clamp(18px,6vw,24px)]">
                        <span>{presenter}</span>
                      </div>
                    </Bento.Item>
                  ) : (
                    <Bento.Placeholder
                      className="[grid-area:credits] min-h-12"
                      data-placeholder-for="presenter"
                      withPattern
                    />
                  )}

                  {/* Credits - Note: If we have credits but no presenter we shift the credits box into the presenter slot for better left-to-right reading flow */}
                  {credits && credits !== '' ? (
                    <Bento.Item
                      icon="graduation-cap"
                      label="Credits"
                      className={cn(
                        {
                          '[grid-area:credits]': presenter && presenter !== '',
                          '[grid-area-presenter]': !presenter,
                        },
                        'flex flex-col',
                      )}
                    >
                      <div className="flex flex-col gap-1 grow justify-center font-medium text-[clamp(18px,6vw,24px)]">
                        <span>{credits}</span>
                      </div>
                    </Bento.Item>
                  ) : (
                    <Bento.Placeholder
                      className="[grid-area:credits] min-h-12"
                      data-placeholder-for="credits"
                      withPattern
                    />
                  )}
                </>
              ) : (
                <>
                  {/* Placeholder used as an accent when no presenter and no credits are provided */}
                  {!presenter && !credits && (
                    <Bento.Placeholder
                      className="[grid-area:placeholder] min-h-12"
                      data-placeholder-for="details"
                      withPattern
                    />
                  )}
                </>
              )}
            </Bento>
          )}
          <Bento
            className={cn('mt-4', {
              // Important Dates show the date and time
              "[grid-template-areas:'date'_'time'] lg:[grid-template-areas:'date_time']":
                eventType === 'importantDate',
              // In-Person events show the date, time, and map
              "[grid-template-areas:'date'_'time'_'contact'_'map'_'map'_'map'] lg:[grid-template-areas:'date_map_map'_'time_map_map'_'contact_map_map']":
                eventType !== 'importantDate' && attendanceOptions === 'inPerson',
              // Virtual events show the date, time, and link
              "[grid-template-areas:'date'_'time'_'link'_'contact'] lg:[grid-template-areas:'date_time'_'link_contact']":
                eventType !== 'importantDate' && attendanceOptions === 'virtual',
              // Hybrid events show the date, time, link, and map
              "[grid-template-areas:'date'_'time'_'link'_'contact'_'map'_'map'_'map'] lg:[grid-template-areas:'date_time_map_map'_'link_link_map_map'_'contact_contact_map_map']":
                eventType !== 'importantDate' && attendanceOptions === 'hybrid',
            })}
          >
            {/* Date */}
            <Bento.Item icon="calendar" label="Date" className="[grid-area:date] flex flex-col">
              <div className="flex flex-col gap-1 grow justify-center font-medium text-[clamp(18px,6vw,24px)]">
                <span>{`${formattedStartDate}${formattedEndDate ? ` \u2014` : ''}`}</span>
                {formattedEndDate && <span>{formattedEndDate}</span>}
              </div>
            </Bento.Item>

            {/* Time */}
            <Bento.Item icon="clock" label="Time" className="[grid-area:time] flex flex-col">
              <div className="flex flex-col gap-1 font-medium grow justify-center">
                <span className="text-[clamp(18px,6vw,24px)]">
                  {`${formattedStartTime}${formattedEndTime ? ` \u2014 ${formattedEndTime}` : ''}`}
                </span>
                {formattedRegistrationTime && (
                  <span className="italic text-foreground-muted text-[clamp(16px,4vw,20px)]">
                    ({formattedRegistrationTime} Registration)
                  </span>
                )}
              </div>
            </Bento.Item>

            {/* Virtual */}
            {eventType !== 'importantDate' && attendanceOptions !== 'inPerson' && (
              <Bento.Item icon="webcam" label="Virtual Attendance" className="[grid-area:link]">
                {virtualLink ? (
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

            {/* Contact */}
            {eventType !== 'importantDate' && contact && typeof contact === 'object' && (
              <Bento.Item
                icon="contact"
                label="Organizer"
                className="[grid-area:contact] flex flex-col"
              >
                <div className="flex grow items-center">
                  <ContactPerson contact={contact} size="md" />
                </div>
              </Bento.Item>
            )}

            {/* Location */}
            {eventType !== 'importantDate' && attendanceOptions !== 'virtual' && (
              <Bento.Item icon="map-pin" label="Location" className="[grid-area:map] flex flex-col">
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
                    <GoogleMap location={location} height={200} containerClassName="rounded-lg" />
                  </div>
                ) : (
                  <div className="flex flex-col grow">
                    <span className="text-lg font-medium">Location Details Unavailable</span>
                    <div className="flex grow items-center justify-center">
                      <MapPinXIcon size={48} className="text-foreground-muted" />
                    </div>
                  </div>
                )}
              </Bento.Item>
            )}
          </Bento>
        </div>
      </div>
    </div>
  );
};

const EventResources: React.FC<Event> = ({ description, resources }) => {
  return (
    <div className="px-4 pt-8 pb-5">
      <div className="max-w-7xl mx-auto flex flex-col items-start gap-4">
        <TitleTheme size="responsive" animated={!description}>
          Meeting Resources
        </TitleTheme>
        <ResourceList resources={resources} />
      </div>
    </div>
  );
};

const EventRelated: React.FC<{ animateSectionTitle: boolean; events: EventTileData[] }> = ({
  animateSectionTitle,
  events,
}) => {
  return (
    <div className="px-4 pt-8 pb-12 lg:pb-20">
      <div className="max-w-7xl mx-auto flex flex-col items-start gap-4">
        <TitleTheme size="responsive" animated={animateSectionTitle}>
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
                <EventTileHeader />
                <EventTileDetail />
              </EventTile>
            ))
          ) : (
            <EventTile className="lg:col-span-8">
              <EventTileNoEvents />
            </EventTile>
          )}
          <EventTile
            event="all"
            className={cn({
              'lg:col-span-4': events.length > 1 || events.length === 0,
              'lg:col-span-6': events.length === 1,
            })}
          >
            <EventTileHeader />
            <EventTileDetail />
          </EventTile>
        </div>
      </div>
    </div>
  );
};

export default EventPageClient;
