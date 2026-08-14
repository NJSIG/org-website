'use client';

import { ContactPerson } from '@/components/ContactPerson';
import {
  EventTile,
  EventTileDetail,
  EventTileHeader,
  EventTileNoEvents,
} from '@/components/EventTile';
import type { EventTileData } from '@/components/EventTile/types';
import type { FetchPage } from '@/components/hooks/usePaginatedData';
import { PastMeetingsList } from '@/components/PastMeetingsList';
import ResourceList from '@/components/ResourceList';
import { RichText } from '@/components/RichText';
import TitleTheme from '@/components/TitleTheme';
import type { Event, Subfund } from '@/payload-types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/primitives/ui/accordion';
import { useHeaderTheme } from '@/providers/HeaderThemeProvider';
import { cn } from '@/utilities/cn';
import coolifyImageLoader from '@/utilities/coolifyImageLoader';
import { hasText } from '@payloadcms/richtext-lexical/shared';
import Image from 'next/image';
import type { PaginatedDocs } from 'payload';
import { useEffect } from 'react';

type SubfundPageClientProps = {
  subfund: Subfund;
  upcomingEvents: EventTileData[];
  pastMeetings: PaginatedDocs<Event> | null;
  fetchPastMeetingsPage: FetchPage<Event>;
};

const SubfundPageClient: React.FC<SubfundPageClientProps> = ({
  subfund,
  upcomingEvents,
  pastMeetings,
  fetchPastMeetingsPage,
}) => {
  const { setHeaderTheme } = useHeaderTheme();

  useEffect(() => {
    setHeaderTheme('light');
  }, [setHeaderTheme]);

  return (
    <div className="subfund-theme pb-12" data-subfund-theme={subfund.theme}>
      {/* Sub-fund Header */}
      <section className="flex items-center justify-center bg-(--subfund-background) px-6 py-10">
        <div className="relative flex w-full max-w-section flex-col gap-4">
          <h2 className="border-b-10 border-(--subfund-accent) pb-1 text-5xl font-extrabold text-(--subfund-foreground)">
            {subfund.shortName}
          </h2>
          <RichText data={subfund.content.summary} className="mx-0 max-w-section-content" />
          <div className="flex flex-col gap-4 md:flex-row">
            {subfund.content.administrators && (
              <div className="flex flex-col gap-2">
                {subfund.content.administrators.map((admin) => {
                  if (typeof admin === 'string') {
                    return null;
                  }

                  return <ContactPerson key={admin.id} contact={admin} />;
                })}
              </div>
            )}
            {subfund.content.reps && (
              <div className="flex flex-col gap-2">
                {subfund.content.reps.map((rep) => {
                  if (typeof rep === 'string') {
                    return null;
                  }

                  return <ContactPerson key={rep.id} contact={rep} />;
                })}
              </div>
            )}
          </div>
          <Image
            className="absolute -top-4 right-0 hidden h-auto w-52 md:block"
            src={`/assets/sub-funds/${subfund.theme}-map.svg`}
            alt={`${subfund.shortName} Map`}
            width={0}
            height={0}
            unoptimized
            priority
            loader={coolifyImageLoader}
          />
        </div>
      </section>
      {/* Upcoming Events */}
      <section className="flex items-center justify-center px-4 py-12 lg:px-6">
        <div className="flex w-full max-w-section flex-col gap-8">
          <TitleTheme size="responsive" animated={false} className="mr-auto">
            Upcoming Sub-fund Events
          </TitleTheme>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {upcomingEvents && upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <EventTile
                  key={event.id}
                  event={event}
                  className={cn({
                    'lg:col-span-4': upcomingEvents.length > 1,
                    'lg:col-span-6': upcomingEvents.length === 1,
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
                'lg:col-span-4': upcomingEvents.length > 1 || upcomingEvents.length === 0,
                'lg:col-span-6': upcomingEvents.length === 1,
              })}
            >
              <EventTileHeader />
              <EventTileDetail />
            </EventTile>
          </div>
        </div>
      </section>
      {/* Sub-fund Resources */}
      {subfund.content.resources && subfund.content.resources.length > 0 && (
        <section className="flex items-center justify-center px-4 py-12 lg:px-6">
          <div className="flex w-full max-w-section flex-col gap-8">
            <TitleTheme size="responsive" animated={true} className="mr-auto">
              Sub-fund Resources
            </TitleTheme>
            <ResourceList finishOddGrid resources={subfund.content.resources} />
          </div>
        </section>
      )}
      {/* Sub-fund Meetings */}
      {pastMeetings?.totalDocs && pastMeetings.totalDocs > 0 && (
        <section className="flex items-center justify-center px-4 py-12 lg:px-6">
          <div className="flex w-full max-w-section flex-col gap-8">
            <TitleTheme size="responsive" animated={true} className="mr-auto">
              Past Sub-fund Meetings
            </TitleTheme>
            <PastMeetingsList meetings={pastMeetings} fetchPage={fetchPastMeetingsPage} />
          </div>
        </section>
      )}
      {/* Sub-fund Additional Offerings */}
      {subfund.content.additionalOfferings && subfund.content.additionalOfferings.length > 0 && (
        <section className="flex items-center justify-center px-4 py-12 lg:px-6">
          <div className="flex w-full max-w-section flex-col gap-8">
            <TitleTheme size="responsive" animated={true} className="mr-auto">
              Additional Offerings
            </TitleTheme>
            <Accordion type="single" collapsible className="w-full">
              {subfund.content.additionalOfferings.map((offering, index) => (
                <AccordionItem key={offering.id} value={`offering-${offering.id}`}>
                  <AccordionTrigger className="[&>svg]:stroke-(--subfund-foreground)">
                    <div>
                      <h3 className="text-lg font-bold">{offering.title}</h3>
                      {offering.subtitle && (
                        <span className="text-sm font-normal text-foreground-muted">
                          {offering.subtitle}
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {hasText(offering.content) && <RichText data={offering.content} />}
                    {offering.resources && offering.resources.length > 0 && (
                      <div className="mt-4">
                        <ResourceList nested resources={offering.resources} />
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}
    </div>
  );
};

export default SubfundPageClient;
