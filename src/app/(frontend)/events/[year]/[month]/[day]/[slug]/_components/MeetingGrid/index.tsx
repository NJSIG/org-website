import Bento from '@/components/Bento';
import { ContactPerson } from '@/components/ContactPerson';
import { GoogleMap } from '@/components/GoogleMap';
import { Hyperlink } from '@/components/Hyperlink';
import { RichText } from '@/components/RichText';
import type { Contact, Event, Location } from '@/payload-types';
import { cn } from '@/utilities/cn';
import { hasText } from '@payloadcms/richtext-lexical/shared';
import { MapPinXIcon } from 'lucide-react';
import './index.css';

type MeetingGridProps = {
  attendance: Event['attendanceOptions'];
  presentationTitle: Event['presentationTitle'];
  description: Event['description'];
  presenters: Event['presenters'];
  credits: Event['credits'];
  formattedStartDate: string;
  formattedStartTime: string;
  formattedRegistrationTime: string | null;
  formattedEndDate: string | null;
  formattedEndTime: string | null;
  location: Location | null;
  virtual: {
    link: string | null | undefined;
    linkType: string;
    provider: string;
    passcode: string | null | undefined;
  } | null;
  contact: Contact | null;
};

export const MeetingGrid: React.FC<MeetingGridProps> = ({
  attendance,
  presentationTitle,
  description,
  presenters,
  credits,
  formattedStartDate,
  formattedStartTime,
  formattedRegistrationTime,
  formattedEndDate,
  formattedEndTime,
  location,
  virtual,
  contact,
}) => {
  const dateRange = formattedEndDate
    ? `${formattedStartDate} \u2014 ${formattedEndDate}`
    : formattedStartDate;
  const timeRange = formattedEndTime
    ? `${formattedStartTime} \u2014 ${formattedEndTime}`
    : formattedStartTime;

  return (
    <>
      <PresentationSubGrid
        presentationTitle={presentationTitle}
        description={description}
        presenters={presenters}
        credits={credits}
      />
      <Bento
        className={cn(
          'auto-rows-auto [grid-template-areas:var(--grid-sm)] md:[grid-template-areas:var(--grid-md)] lg:[grid-template-areas:var(--grid-lg)] xl:[grid-template-areas:var(--grid-xl)]',
          {
            'details--virtual': attendance === 'virtual',
            'details--in-person': attendance === 'inPerson',
            'details--hybrid': attendance === 'hybrid',
          },
        )}
      >
        {/* Date */}
        <Bento.Item icon="calendar" label="Date" className="[grid-area:date] flex flex-col grow">
          <div className="flex flex-col gap-1 grow justify-center font-medium text-[clamp(20px,1vw,24px)]">
            <span>{dateRange}</span>
          </div>
        </Bento.Item>

        {/* Time */}
        <Bento.Item icon="clock" label="Time" className="[grid-area:time] flex flex-col">
          <div className="flex flex-col gap-1 grow justify-center font-medium text-[clamp(20px,1vw,24px)]">
            <span>{timeRange}</span>
            {formattedRegistrationTime && (
              <span className="italic text-foreground-muted text-[clamp(16px,1vw,18px)]">
                ({formattedRegistrationTime} Registration)
              </span>
            )}
          </div>
        </Bento.Item>

        {/* Virtual */}
        {attendance !== 'inPerson' && virtual && (
          <Bento.Item
            icon="webcam"
            label={virtual.provider}
            className="[grid-area:virtual] flex flex-col"
          >
            <div className="flex flex-col gap-1 grow justify-center">
              {virtual.link ? (
                <>
                  <Hyperlink
                    link={{ url: virtual.link, newTab: true, allowReferrer: false }}
                    newTabIndicator
                    className="text-[clamp(20px,1vw,24px)] font-medium"
                  >
                    {virtual.linkType}
                  </Hyperlink>
                  {virtual.passcode && (
                    <span className="text-[clamp(16px,1vw,18px)] text-foreground-muted">
                      Passcode: <strong>{virtual.passcode}</strong>
                    </span>
                  )}
                </>
              ) : (
                <span className="text-[clamp(20px,1vw,24px)] font-medium">
                  Virtual Attendance Details Unavailable
                </span>
              )}
            </div>
          </Bento.Item>
        )}

        {/* Location */}
        {attendance !== 'virtual' && (
          <Bento.Item
            icon="map-pin"
            label="Location"
            className="[grid-area:location] flex flex-col"
          >
            {location ? (
              <div className="flex flex-col gap-1">
                {location.website?.url && location.website.url.trim() !== '' ? (
                  <Hyperlink
                    link={location.website}
                    newTabIndicator
                    className="text-lg font-medium"
                  >
                    {location.name}
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

        {/* Contact */}
        {contact && (
          <>
            <Bento.Item
              icon="contact"
              label="NJSIG Organizer"
              className="[grid-area:contact] flex flex-col"
            >
              <div className="flex grow items-center">
                <ContactPerson contact={contact} size="md" />
              </div>
            </Bento.Item>
            <Bento.Placeholder
              className={cn(
                '[grid-area:contact-placeholder] hidden',
                {
                  'xl:block': attendance === 'virtual',
                  'md:max-lg:block': attendance === 'inPerson',
                  'lg:block': attendance === 'hybrid',
                },
              )}
            />
          </>
        )}
      </Bento>
    </>
  );
};

const PresentationSubGrid: React.FC<
  Pick<MeetingGridProps, 'presentationTitle' | 'description' | 'presenters' | 'credits'>
> = ({ presentationTitle, description, presenters, credits }) => {
  const hasDescription = hasText(description);
  const hasPresenters = presenters && presenters.length > 0;
  const hasCredits = credits && credits.length > 0;

  if (hasDescription || hasPresenters || hasCredits) {
    if (presentationTitle || hasDescription) {
      return (
        <Bento className="auto-rows-auto presentation presentation--with-description [grid-template-areas:var(--grid-sm)] lg:[grid-template-areas:var(--grid-lg)] lg:gap-y-0 mb-4">
          {/* Description */}
          <Bento.Item icon="book-open-text" label="Description" className="[grid-area:description]">
            {presentationTitle && (
              <h3 className="font-bold text-[clamp(20px,1vw,24px)] mb-2">{presentationTitle}</h3>
            )}
            {hasDescription && <RichText data={description} className="mx-0" />}
          </Bento.Item>

          {/* Presenters & Credits */}
          {hasPresenters || hasCredits ? (
            <div className="[grid-area:presenter-credits] flex flex-col h-full details__presenter-credits-column">
              <div className="details__presenter-credits-row flex flex-col md:flex-row gap-4 h-full md:max-h-55">
                {/* Presenter */}
                {hasPresenters && (
                  <Bento.Item
                    icon="megaphone"
                    label={presenters.length > 1 ? 'Presenters' : 'Presenter'}
                    className="flex flex-col grow basis-1/2"
                  >
                    <div className="flex flex-col gap-2 grow">
                      {presenters.map((p, index) => (
                        <div key={index} className="overflow-hidden">
                          <p className="font-medium text-[clamp(16px,1vw,18px)] whitespace-nowrap overflow-hidden text-ellipsis">
                            {p.name}
                          </p>
                          {p.title && p.title !== '' && (
                            <small className="text-sm text-foreground-muted whitespace-nowrap overflow-hidden text-ellipsis">
                              {p.title}
                            </small>
                          )}
                        </div>
                      ))}
                    </div>
                  </Bento.Item>
                )}

                {/* Credits */}
                {hasCredits && (
                  <Bento.Item
                    icon="graduation-cap"
                    label={credits.length > 1 ? 'Credits' : 'Credit'}
                    className="flex flex-col grow basis-1/2"
                  >
                    <div className="flex flex-col gap-2 grow">
                      {credits.map((c, index) => (
                        <div key={index} className="overflow-hidden">
                          <p className="font-medium text-[clamp(16px,1vw,18px)] whitespace-nowrap overflow-hidden text-ellipsis">
                            {c.creditType}
                          </p>
                          <small className="text-sm text-foreground-muted whitespace-nowrap overflow-hidden text-ellipsis">
                            {c.credit}
                          </small>
                        </div>
                      ))}
                    </div>
                  </Bento.Item>
                )}
              </div>

              {/* Placeholder */}
              <div className="hidden md:flex md:items-end md:h-(--placeholder-container-height)">
                <Bento.Placeholder className="details__placeholder w-full md:h-(--placeholder-height)" />
              </div>
            </div>
          ) : (
            <Bento.Placeholder className="[grid-area:presenter-credits]" />
          )}
        </Bento>
      );
    }

    return (
      <Bento className="presentation auto-rows-auto [grid-template-areas:var(--grid-sm)] md:[grid-template-areas:var(--grid-md)] lg:[grid-template-areas:var(--grid-lg)] mb-4">
        {/* Presenter */}
        {hasPresenters && (
          <Bento.Item
            icon="megaphone"
            label={presenters.length > 1 ? 'Presenters' : 'Presenter'}
            className={cn('flex flex-col', {
              '[grid-area:presenter]': hasCredits,
              '[grid-area:presenter/presenter/presenter/credits]': !hasCredits,
            })}
          >
            <div className="flex flex-col gap-2 grow">
              {presenters.map((p, index) => (
                <div key={index} className="overflow-hidden">
                  <p className="font-medium text-[clamp(16px,1vw,18px)] whitespace-nowrap overflow-hidden text-ellipsis">
                    {p.name}
                  </p>
                  {p.title && p.title !== '' && (
                    <small className="text-sm text-foreground-muted whitespace-nowrap overflow-hidden text-ellipsis">
                      {p.title}
                    </small>
                  )}
                </div>
              ))}
            </div>
          </Bento.Item>
        )}

        {/* Credits */}
        {hasCredits && (
          <Bento.Item
            icon="graduation-cap"
            label={credits.length > 1 ? 'Credits' : 'Credit'}
            className={cn('flex flex-col', {
              '[grid-area:credits]': hasPresenters,
              '[grid-area:presenter/presenter/presenter/credits]': !hasPresenters,
            })}
          >
            <div className="flex flex-col gap-2 grow">
              {credits.map((c, index) => (
                <div key={index} className="overflow-hidden">
                  <p className="font-medium text-[clamp(16px,1vw,18px)] whitespace-nowrap overflow-hidden text-ellipsis">
                    {c.creditType}
                  </p>
                  <small className="text-sm text-foreground-muted whitespace-nowrap overflow-hidden text-ellipsis">
                    {c.credit}
                  </small>
                </div>
              ))}
            </div>
          </Bento.Item>
        )}

        {/* Placeholder */}
        <Bento.Placeholder className="[grid-area:placeholder] hidden lg:block" />
      </Bento>
    );
  }

  return null;
};
