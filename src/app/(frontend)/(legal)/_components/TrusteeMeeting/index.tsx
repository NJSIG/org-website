import { Button } from '@/primitives/ui/button';
import { Temporal } from '@js-temporal/polyfill';
import { ArrowUpRightIcon, DownloadIcon } from 'lucide-react';
import Link from 'next/link';
import { RequiredDataFromCollectionSlug } from 'payload';
import { LegalPill } from '../LegalPill';

export type TrusteeMeetingCardProps = Pick<
  RequiredDataFromCollectionSlug<'events'>,
  | 'id'
  | 'slug'
  | 'startDate'
  | 'eventType'
  | 'title'
  | 'trusteeMeetingAgenda'
  | 'trusteeMeetingMinutes'
>;

const errorPageUrl = '/404';

export const TrusteeMeetingCard: React.FC<TrusteeMeetingCardProps> = ({
  slug,
  startDate,
  title,
  trusteeMeetingAgenda: agenda,
  trusteeMeetingMinutes: minutes,
}) => {
  const date = Temporal.PlainDate.from(startDate.slice(0, 10));
  const eventLink = slug ? `/events/${date.year}/${date.month}/${date.day}/${slug}` : null;
  const agendaLink =
    agenda?.resource?.document && typeof agenda.resource.document === 'object'
      ? agenda.resource.document.url
      : null;
  const minutesLink =
    minutes?.resource?.document && typeof minutes.resource.document === 'object'
      ? minutes.resource.document.url
      : null;

  return (
    <div className="rounded-3xl bg-njsig-neutral-tint p-4">
      <small className="flex items-center justify-between">
        <span className="text-sm font-semibold">
          {date.toLocaleString('en-US', { dateStyle: 'medium' })}
        </span>
        <LegalPill type="trusteeMeeting" label="Trustee Meeting" />
      </small>
      <h3 className="font-light tracking-wide text-2xl mb-4">{title}</h3>
      <div className="flex flex-col md:flex-row items-center gap-6">
        {eventLink ? (
          <Button
            asChild
            variant="button"
            style="ghost"
            color="primary"
            size="medium"
            animation="upRight"
          >
            <Link href={eventLink || errorPageUrl}>
              <span>View Event</span>
              <ArrowUpRightIcon size={16} />
            </Link>
          </Button>
        ) : (
          <Button
            variant="button"
            style="ghost"
            color="primary"
            size="medium"
            animation="none"
            disabled={true}
          >
            <span>View Event</span>
            <ArrowUpRightIcon size={16} />
          </Button>
        )}
        {agendaLink ? (
          <Button
            asChild
            variant="button"
            style="ghost"
            color="primary"
            size="medium"
            animation={'bounceDown'}
          >
            <Link href={agendaLink || errorPageUrl} target="_blank">
              <span>Meeting Agenda</span>
              <DownloadIcon size={16} />
            </Link>
          </Button>
        ) : (
          <Button
            variant="button"
            style="ghost"
            color="primary"
            size="medium"
            animation="none"
            disabled={true}
          >
            <span>Meeting Agenda</span>
            <DownloadIcon size={16} />
          </Button>
        )}
        {minutesLink ? (
          <Button
            asChild
            variant="button"
            style="ghost"
            color="primary"
            size="medium"
            animation="bounceDown"
          >
            <Link href={minutesLink || errorPageUrl} target="_blank">
              <span>Meeting Minutes</span>
              <DownloadIcon size={16} />
            </Link>
          </Button>
        ) : (
          <Button
            variant="button"
            style="ghost"
            color="primary"
            size="medium"
            animation="none"
            disabled={true}
          >
            <span>Meeting Minutes</span>
            <DownloadIcon size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};
