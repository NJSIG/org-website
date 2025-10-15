'use client';

import { ContactPerson } from '@/components/ContactPerson';
import {
  EventTile,
  EventTileDetail,
  EventTileHeader,
  EventTileNoEvents,
} from '@/components/EventTile';
import { EventTileData } from '@/components/EventTile/types';
import ResourceList from '@/components/ResourceList';
import RichText from '@/components/RichText';
import TitleTheme from '@/components/TitleTheme';
import { Subfund } from '@/payload-types';
import { useHeaderTheme } from '@/providers/HeaderTheme';
import { cn } from '@/utilities/cn';
import Image from 'next/image';
import { useEffect } from 'react';

type SubfundPageClientProps = {
  subfund: Subfund;
  upcomingEvents: EventTileData[];
};

const SubfundPageClient: React.FC<SubfundPageClientProps> = ({ subfund, upcomingEvents }) => {
  const { setHeaderTheme } = useHeaderTheme();

  useEffect(() => {
    setHeaderTheme('light');
  }, [setHeaderTheme]);

  return (
    <div className={cn(`subfund-theme-${subfund.shortName.toLocaleLowerCase()}`)}>
      {/* Sub-fund Header */}
      <section className="px-6 py-10 flex items-center justify-center bg-[var(--subfund-background)]">
        <div className="w-full max-w-section flex flex-col gap-4 relative">
          <h2 className="pb-1 text-5xl font-extrabold text-[var(--subfund-foreground)] border-b-[10px] border-[var(--subfund-accent)]">
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
            className="hidden md:block absolute right-0 -top-4"
            src={`/assets/sub-funds/${subfund.slug}-map.svg`}
            alt={`${subfund.shortName} Map`}
            height={298.5}
            width={200}
            unoptimized
          />
        </div>
      </section>
      {/* Upcoming Events */}
      <section className="px-4 pt-8 pb-12 lg:px-6 lg:pt-9 lg:pb-16 xl:pt-16 xl:pb-20 flex items-center justify-center">
        <div className="w-full max-w-section flex flex-col gap-8">
          <TitleTheme size="responsive" animated={false} className="mr-auto">
            Upcoming Sub-fund Events
          </TitleTheme>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
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
      <section className="px-4 pt-8 pb-12 lg:px-6 lg:pt-9 lg:pb-16 xl:pt-16 xl:pb-20 flex items-center justify-center">
        <div className="w-full max-w-section flex flex-col gap-8">
          <TitleTheme size="responsive" animated={true} className="mr-auto">
            Sub-fund Resources
          </TitleTheme>
          <ResourceList resources={subfund.content.resources} />
        </div>
      </section>
    </div>
  );
};

export default SubfundPageClient;
