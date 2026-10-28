import { Button, buttonVariants } from '@/primitives/ui/button';
import { generateEventLink } from '@/utilities/generateEventLink';
import { cn } from 'cn';
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
    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
      <Link
        href={href}
        className={cn(
          buttonVariants({
            variant: 'button',
            style: 'outline',
            color: 'primary',
            size: 'medium',
            animation: 'upRight',
          }),
          'grow',
        )}
      >
        <span>View Event</span>
        <ArrowUpRightIcon size={16} />
      </Link>
      {agendaLink ? (
        <Link
          href={agendaLink}
          className={cn(
            buttonVariants({
              variant: 'button',
              style: 'outline',
              color: 'primary',
              size: 'medium',
              animation: 'bounceDown',
            }),
            'grow',
          )}
        >
          <span>Download Agenda</span>
          <DownloadIcon size={16} />
        </Link>
      ) : (
        <Button
          disabled
          variant="button"
          style="outline"
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
        <Link
          href={minutesLink}
          className={cn(
            buttonVariants({
              variant: 'button',
              style: 'outline',
              color: 'primary',
              size: 'medium',
              animation: 'bounceDown',
            }),
            'grow',
          )}
        >
          <span>Download Minutes</span>
          <DownloadIcon size={16} />
        </Link>
      ) : (
        <Button
          disabled
          variant="button"
          style="outline"
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
