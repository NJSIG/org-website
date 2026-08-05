import Bento from '@/components/Bento';
import { ContactPerson } from '@/components/ContactPerson';
import { GoogleMap } from '@/components/GoogleMap';
import { Hyperlink } from '@/components/Hyperlink';
import { RichText } from '@/components/RichText';
import type { Contact, Event, Location } from '@/payload-types';
import { cn } from '@/utilities/cn';
import { hasText } from '@payloadcms/richtext-lexical/shared';
import { MapPinXIcon } from 'lucide-react';
import styles from './grid.module.css';

type TrusteeMeetingGridProps = {
  attendance: Event['attendanceOptions'];
  description: Event['description'];
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

export const TrusteeMeetingGrid: React.FC<TrusteeMeetingGridProps> = ({
  attendance,
  description,
  formattedStartDate,
  formattedStartTime,
  formattedRegistrationTime,
  formattedEndDate,
  formattedEndTime,
  location,
  virtual,
  contact,
}) => {
  const hasDescription = hasText(description);
  const dateRange = formattedEndDate
    ? `${formattedStartDate} \u2014 ${formattedEndDate}`
    : formattedStartDate;
  const timeRange = formattedEndTime
    ? `${formattedStartTime} \u2014 ${formattedEndTime}`
    : formattedStartTime;

  return (
    <Bento
      className={cn(
        styles.details,
        'auto-rows-auto [grid-template-areas:var(--grid-sm)] md:[grid-template-areas:var(--grid-md)] lg:[grid-template-areas:var(--grid-lg)] xl:[grid-template-areas:var(--grid-xl)]',
        {
          [styles['details--virtual']]: attendance === 'virtual',
          [styles['details--in-person']]: attendance === 'inPerson',
          [styles['details--hybrid']]: attendance === 'hybrid',
          [styles['details--with-description']]: hasDescription,
        },
      )}
    >
      {/* Description */}
      {hasDescription && (
        <>
          <Bento.Item icon="book-open-text" label="Description" className="[grid-area:description]">
            <RichText data={description} className="mx-0" />
          </Bento.Item>
          <Bento.Placeholder className="hidden [grid-area:description-placeholder] lg:block" />
        </>
      )}

      {/* Date */}
      <Bento.Item icon="calendar" label="Date" className="flex grow flex-col [grid-area:date]">
        <div className="flex grow flex-col justify-center gap-1 text-[clamp(20px,1vw,24px)] font-medium">
          <span>{dateRange}</span>
        </div>
      </Bento.Item>

      {/* Time */}
      <Bento.Item icon="clock" label="Time" className="flex flex-col [grid-area:time]">
        <div className="flex grow flex-col justify-center gap-1 text-[clamp(20px,1vw,24px)] font-medium">
          <span>{timeRange}</span>
          {formattedRegistrationTime && (
            <span className="text-[clamp(16px,1vw,18px)] text-foreground-muted italic">
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
          className="flex flex-col [grid-area:virtual]"
        >
          <div className="flex grow flex-col justify-center gap-1">
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
        <Bento.Item icon="map-pin" label="Location" className="flex flex-col [grid-area:location]">
          {location ? (
            <div className="flex flex-col gap-1">
              {location.website?.url && location.website.url.trim() !== '' ? (
                <Hyperlink link={location.website} newTabIndicator className="text-lg font-medium">
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
            <div className="flex grow flex-col">
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
            className="flex flex-col [grid-area:contact]"
          >
            <div className="flex grow items-center">
              <ContactPerson contact={contact} size="md" />
            </div>
          </Bento.Item>
          <Bento.Placeholder
            className={cn('hidden [grid-area:contact-placeholder]', {
              'xl:block': attendance === 'virtual',
              'md:max-lg:block': attendance === 'inPerson',
              'lg:block': attendance === 'hybrid',
            })}
          />
        </>
      )}
    </Bento>
  );
};
