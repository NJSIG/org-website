'use client';

import { generateEventLink } from '@/utilities/generateEventLink';
import { Temporal } from '@js-temporal/polyfill';
import Link from 'next/link';
import EventCardContainer from './components/EventCardContainer';
import { EventCardLabel } from './components/EventCardLabel';
import { EventCardTags } from './components/EventCardTags';
import { EventCardTitle } from './components/EventCardTitle';
import { EventCardTrusteeLinks } from './components/EventCardTrusteeLinks';
import { EventCardData } from './types';

export enum EventCardTemplate {
  Default = 'default',
  TrusteeMeeting = 'trusteeMeeting',
}

const EventCard: React.FC<{
  event: EventCardData;
  template?: EventCardTemplate;
}> = ({ event, template = EventCardTemplate.Default }) => {
  switch (template) {
    case EventCardTemplate.TrusteeMeeting:
      return <TrusteeMeetingTemplate event={event} />;
    case EventCardTemplate.Default:
    default:
      return <DefaultTemplate event={event} />;
  }
};

const DefaultTemplate: React.FC<{ event: EventCardData }> = ({ event }) => {
  const { eventType, startDate, endDate, title, categories, important } = event;
  const href = generateEventLink(event);

  return (
    <EventCardContainer eventType={eventType} important={important} isLink asChild>
      <Link href={href}>
        <EventCardLabel startDate={startDate} endDate={endDate} />
        <EventCardTitle title={title} />
        <EventCardTags eventType={eventType} important={important} categories={categories} />
      </Link>
    </EventCardContainer>
  );
};

const TrusteeMeetingTemplate: React.FC<{ event: EventCardData }> = ({ event }) => {
  const { eventType, startDate, categories, important } = event;

  const title = Temporal.PlainDate.from(startDate.slice(0, 10)).toLocaleString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <EventCardContainer eventType={eventType} important={important}>
      <EventCardTitle title={title} />
      <EventCardTrusteeLinks event={event} />
      <EventCardTags eventType={eventType} important={important} categories={categories} />
    </EventCardContainer>
  );
};

export default EventCard;
