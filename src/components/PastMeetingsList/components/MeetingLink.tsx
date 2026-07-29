'use client';

import { useIsTruncated } from '@/components/hooks/useIsTruncated';
import { Event } from '@/payload-types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/primitives/ui/tooltip';
import { ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

export const MeetingLink: React.FC<{ meeting: Event }> = ({ meeting }) => {
  const meetingTitleRef = useRef<HTMLHeadingElement | null>(null);
  const { isTruncated } = useIsTruncated({ elementRef: meetingTitleRef });
  const startDate = new Date(meeting.startDate);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  }).format(startDate);

  const meetingLabel = meeting.presentationTitle || meeting.title;

  return (
    <Link
      href={getMeetingLink(startDate, meeting.slug!)}
      target="_blank"
      className="group/past-meeting flex items-center p-4 gap-4 transition-colors rounded-3xl bg-njsig-neutral-tint hover:bg-mix-shade-njsig-neutral-tint/2 w-full"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="grow overflow-hidden">
            <small className="text-sm text-foreground-muted">{formattedDate}</small>
            <h4
              className="text-lg font-bold whitespace-nowrap overflow-hidden text-ellipsis"
              ref={meetingTitleRef}
            >
              {meetingLabel}
            </h4>
          </div>
        </TooltipTrigger>
        {isTruncated && <TooltipContent>{meetingLabel}</TooltipContent>}
      </Tooltip>
      <div className="flex items-center gap-4 text-(--subfund-foreground)">
        <ExternalLinkIcon
          size={24}
          className="group-hover/past-meeting:motion-safe:animate-icon-external-link"
        />
      </div>
    </Link>
  );
};

function getMeetingLink(startDate: Date, slug: string): string {
  return `/events/${startDate.getFullYear()}/${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getDate().toString().padStart(2, '0')}/${slug}`;
}
