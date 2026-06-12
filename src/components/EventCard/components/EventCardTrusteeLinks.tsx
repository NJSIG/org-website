import { Button } from '@/primitives/ui/button';
import { generateEventLink } from '@/utilities/generateEventLink';
import { ArrowUpRightIcon, DownloadIcon } from 'lucide-react';
import Link from 'next/link';
import { EventCardData } from '../types';

export const EventCardTrusteeLinks: React.FC<{ event: EventCardData }> = ({ event }) => {
  const href = generateEventLink(event);

  const agendaLink =
    event.trusteeMeetingAgenda?.resource?.document &&
    typeof event.trusteeMeetingAgenda.resource.document === 'object'
      ? event.trusteeMeetingAgenda.resource.document.url
      : null;

  const minutesLink =
    event.trusteeMeetingMinutes?.resource?.document &&
    typeof event.trusteeMeetingMinutes.resource.document === 'object'
      ? event.trusteeMeetingMinutes.resource.document.url
      : null;

  return (
    <div className="flex items-center gap-x-6 gap-y-4 mt-4 flex-wrap">
      <Button
        asChild
        variant="button"
        style="ghost"
        color="primary"
        size="medium"
        animation="upRight"
        className="grow"
      >
        <Link href={href}>
          <span>View Event</span>
          <ArrowUpRightIcon size={16} />
        </Link>
      </Button>
      {agendaLink ? (
        <Button
          asChild
          variant="button"
          style="ghost"
          color="primary"
          size="medium"
          animation="bounceDown"
          className="grow"
        >
          <Link href={agendaLink}>
            <span>Download Agenda</span>
            <DownloadIcon size={16} />
          </Link>
        </Button>
      ) : (
        <Button
          disabled
          variant="button"
          style="ghost"
          color="primary"
          size="medium"
          animation="bounceDown"
          className="grow"
        >
          <span>Download Agenda</span>
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
          className="grow"
        >
          <Link href={minutesLink}>
            <span>Download Minutes</span>
            <DownloadIcon size={16} />
          </Link>
        </Button>
      ) : (
        <Button
          disabled
          variant="button"
          style="ghost"
          color="primary"
          size="medium"
          animation="bounceDown"
          className="grow"
        >
          <span>Download Minutes</span>
          <DownloadIcon size={16} />
        </Button>
      )}
    </div>
  );
};
