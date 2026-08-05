'use client';

import Bento from '@/components/Bento';
import { EventCardType } from '@/components/EventCard/components/EventCardType';
import {
  EventTile,
  EventTileDetail,
  EventTileHeader,
  EventTileNoEvents,
} from '@/components/EventTile';
import { EventTileData } from '@/components/EventTile/types';
import { PageHeader, PageTitle } from '@/components/PageHeader';
import ResourceItem from '@/components/ResourceItem';
import ResourceList from '@/components/ResourceList';
import { RichText } from '@/components/RichText';
import { SubfundPill } from '@/components/SubfundPill';
import { SubfundPillSchema } from '@/components/SubfundPill/schema';
import TitleTheme from '@/components/TitleTheme';
import { Event, EventCategory } from '@/payload-types';
import { useHeaderTheme } from '@/providers/HeaderThemeProvider';
import { cn } from '@/utilities/cn';
import { getClientSideUrl } from '@/utilities/getClientSideUrl';
import React, { useEffect } from 'react';
import z from 'zod';
import { ImportantEventGrid } from './_components/ImportantEventGrid';
import { MeetingGrid } from './_components/MeetingGrid';
import { TrusteeMeetingGrid } from './_components/TrusteeMeetingGrid';

type EventPageClientProps = {
  event: Event;
  related: EventTileData[];
};

enum VirtualProviders {
  zoom = 'Zoom',
  googleMeet = 'Google Meet',
  microsoftTeams = 'Microsoft Teams',
  goToMeeting = 'GoTo Meeting',
  other = 'Virtual',
}

enum VirtualLinkTypes {
  meeting = 'Meeting Link',
  registration = 'Registration Link',
}

const SubfundPageLinkSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  linkToSubfund: z.boolean().refine((val) => val === true, {
    error: 'linkToSubfund must be true for generated subfund page links',
  }),
  subfundSlug: z.string().min(1),
});

const EventPageClient: React.FC<EventPageClientProps> = ({ event, related = [] }) => {
  const { setHeaderTheme } = useHeaderTheme();
  const resources = injectSubfundPageResources(event.resources, event.categories);

  useEffect(() => {
    setHeaderTheme('dark'); // Set header theme for event pages
  }, [setHeaderTheme]);

  return (
    <>
      <EventHeader {...event} />
      <EventDetails {...event} />
      {event.eventType === 'trusteeMeeting' && hasMeetingAgenda(event.trusteeMeetingAgenda) && (
        <EventAgenda {...event} />
      )}
      {event.eventType === 'trusteeMeeting' && hasMeetingMinutes(event.trusteeMeetingMinutes) && (
        <EventMinutes {...event} />
      )}
      {event.eventType !== 'trusteeMeeting' && hasResources(resources) && (
        <EventResources {...event} resources={resources} />
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
              const parsedCategory = SubfundPillSchema.safeParse(category);

              if (!parsedCategory.success) {
                return null;
              }

              return (
                <SubfundPill
                  key={parsedCategory.data.id}
                  theme={parsedCategory.data.slug}
                  label={parsedCategory.data.name}
                />
              );
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
  presentationTitle,
  description,
  presenters,
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
  contact: contactFromProps,
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
  const contact = typeof contactFromProps === 'object' ? contactFromProps : null;
  const virtual =
    attendanceOptions !== 'inPerson'
      ? {
          link: virtualLink,
          linkType: getMeetingLinkType(virtualLink),
          provider: getMeetingProvider(virtualProvider),
          passcode: virtualPasscode,
        }
      : null;

  return (
    <div className="px-4 py-12">
      <div className="max-w-7xl mx-auto flex flex-col items-start gap-4">
        <TitleTheme size="responsive" animated={false}>
          Event Details
        </TitleTheme>
        <div className="w-full">
          {(() => {
            switch (eventType) {
              case 'importantDate':
                return (
                  <ImportantEventGrid
                    description={description}
                    formattedStartDate={formattedStartDate}
                    formattedStartTime={formattedStartTime}
                  />
                );
              case 'trusteeMeeting':
                return (
                  <TrusteeMeetingGrid
                    attendance={attendanceOptions}
                    description={description}
                    formattedStartDate={formattedStartDate}
                    formattedStartTime={formattedStartTime}
                    formattedRegistrationTime={formattedRegistrationTime}
                    formattedEndDate={formattedEndDate}
                    formattedEndTime={formattedEndTime}
                    location={location}
                    virtual={virtual}
                    contact={contact}
                  />
                );
              default:
                return (
                  <MeetingGrid
                    attendance={attendanceOptions}
                    presentationTitle={presentationTitle}
                    description={description}
                    presenters={presenters}
                    credits={credits}
                    formattedStartDate={formattedStartDate}
                    formattedStartTime={formattedStartTime}
                    formattedRegistrationTime={formattedRegistrationTime}
                    formattedEndDate={formattedEndDate}
                    formattedEndTime={formattedEndTime}
                    location={location}
                    virtual={virtual}
                    contact={contact}
                  />
                );
            }
          })()}
        </div>
      </div>
    </div>
  );
};

const EventResources: React.FC<Event> = ({ description, resources }) => {
  return (
    <div className="px-4 py-12">
      <div className="max-w-7xl mx-auto flex flex-col items-start gap-4">
        <TitleTheme size="responsive" animated={!description}>
          Meeting Resources
        </TitleTheme>
        <ResourceList finishOddGrid resources={resources} />
      </div>
    </div>
  );
};

const EventAgenda: React.FC<Event> = ({ description, trusteeMeetingAgenda }) => {
  if (trusteeMeetingAgenda === undefined) {
    return null;
  }

  return (
    <div className="px-4 py-12">
      <div className="max-w-7xl mx-auto flex flex-col items-start gap-4">
        <TitleTheme size="responsive" animated={!description}>
          Meeting Agenda
        </TitleTheme>
        {trusteeMeetingAgenda && (
          <Bento
            className={cn(
              "w-full [grid-template-areas:'agenda'] lg:[grid-template-areas:'agenda_placeholder']",
            )}
          >
            <Bento.Generic className="[grid-area:agenda] p-0 flex items-stretch">
              <ResourceItem item={trusteeMeetingAgenda} className="w-full" />
            </Bento.Generic>
            <Bento.Placeholder className="[grid-area:placeholder]" />
          </Bento>
        )}
      </div>
    </div>
  );
};

const EventMinutes: React.FC<Event> = ({ description, trusteeMeetingMinutes }) => {
  if (trusteeMeetingMinutes === undefined) {
    return null;
  }

  return (
    <div className="px-4 py-12">
      <div className="max-w-7xl mx-auto flex flex-col items-start gap-4">
        <TitleTheme size="responsive" animated={!description}>
          Meeting Minutes
        </TitleTheme>
        <Bento
          className={cn('w-full', {
            // Summary Only
            "[grid-template-areas:'summary'] lg:[grid-template-areas:'summary_placeholder']":
              trusteeMeetingMinutes.minutesSummary && !trusteeMeetingMinutes.resource,
            // Resource Only
            "[grid-template-areas:'resource'] lg:[grid-template-areas:'resource_placeholder']":
              !trusteeMeetingMinutes.minutesSummary && trusteeMeetingMinutes.resource,
            // Summary & Resource
            "[grid-template-areas:'summary'_'resource'] lg:[grid-template-areas:'summary_resource'_'summary_placeholder']":
              trusteeMeetingMinutes.minutesSummary && trusteeMeetingMinutes.resource,
          })}
        >
          {trusteeMeetingMinutes.minutesSummary && (
            <Bento.Item icon="notepad-text" label="Summary" className="[grid-area:summary]">
              <RichText data={trusteeMeetingMinutes.minutesSummary} />
            </Bento.Item>
          )}
          {trusteeMeetingMinutes.resource?.document && (
            <Bento.Generic className="[grid-area:resource] p-0 flex items-stretch">
              <ResourceItem item={trusteeMeetingMinutes} className="w-full" />
            </Bento.Generic>
          )}
          <Bento.Placeholder className="[grid-area:placeholder]" />
        </Bento>
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
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
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

function injectSubfundPageResources(
  resources: Event['resources'],
  categories: Event['categories'],
): Event['resources'] {
  const subfundPageResources: Event['resources'] = categories
    .filter((category) => SubfundPageLinkSchema.safeParse(category).success)
    .map((category) => ({
      resource: {
        type: 'link',
        icon: 'link',
        link: {
          type: 'custom',
          newTab: true,
          allowReferrer: true,
          url: `${getClientSideUrl()}/sub-funds/${(category as EventCategory).subfundSlug}`,
          label: `Visit the ${(category as EventCategory).name} Sub-Fund Page`,
        },
      },
    })) as Event['resources'];

  return [...(subfundPageResources || []), ...(resources || [])];
}

function getMeetingLinkType(key: unknown): string {
  if (typeof key === 'string' && Object.hasOwn(VirtualLinkTypes, key)) {
    return VirtualLinkTypes[key as keyof typeof VirtualLinkTypes];
  }

  return 'Meeting Link';
}

function getMeetingProvider(key: unknown): string {
  if (typeof key === 'string' && Object.hasOwn(VirtualProviders, key)) {
    return VirtualProviders[key as keyof typeof VirtualProviders];
  }

  return 'Virtual';
}

function hasMeetingAgenda(agenda: Event['trusteeMeetingAgenda'] | undefined): boolean {
  if (agenda?.resource?.document) {
    return true;
  }

  return false;
}

function hasMeetingMinutes(minutes: Event['trusteeMeetingMinutes'] | undefined): boolean {
  if (minutes?.resource?.document || minutes?.minutesSummary) {
    return true;
  }

  return false;
}

function hasResources(resources: Event['resources'] | undefined): boolean {
  if (resources && Array.isArray(resources) && resources.length > 0) {
    return true;
  }

  return false;
}

export default EventPageClient;
