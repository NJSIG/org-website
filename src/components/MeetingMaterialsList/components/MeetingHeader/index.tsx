import { useHasHydrated } from '@/components/hooks/useHasHydrated';
import { useIsTruncated } from '@/components/hooks/useIsTruncated';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/primitives/ui/tooltip';
import { useRef } from 'react';
import { MeetingMaterialsData } from '../../types';

export const MeetingHeader: React.FC<{ meeting: MeetingMaterialsData }> = ({ meeting }) => {
  const hydrated = useHasHydrated();

  const startDate = hydrated && typeof meeting === 'object' ? new Date(meeting.startDate) : null;

  const formattedDate = startDate
    ? new Intl.DateTimeFormat('en-US', { month: 'long', day: '2-digit', year: 'numeric' }).format(
        startDate,
      )
    : undefined;

  const resourceCount = meeting.resources?.length || 0;
  const resourceCountLabel =
    resourceCount <= 0 ? 'No Items' : resourceCount > 1 ? `${resourceCount} Items` : '1 Item';

  const meetingTitleRef = useRef(null);
  const { isTruncated } = useIsTruncated({ elementRef: meetingTitleRef });

  return (
    <div className="flex items-center gap-4 w-full">
      <Tooltip>
        <TooltipTrigger asChild disabled={resourceCount === 0}>
          <div className="grow overflow-hidden">
            {formattedDate ? (
              <small className="text-sm text-foreground-muted">{formattedDate}</small>
            ) : (
              <small className="text-sm text-foreground-muted">
                <span className="inline-block h-4 w-36 rounded bg-foreground/10 align-middle animate-pulse" />
              </small>
            )}
            <h4
              className="text-lg font-bold whitespace-nowrap overflow-hidden text-ellipsis"
              ref={meetingTitleRef}
            >
              {meeting.title}
            </h4>
          </div>
        </TooltipTrigger>
        {isTruncated && <TooltipContent>{meeting.title}</TooltipContent>}
      </Tooltip>
      <div className="flex items-center gap-4">
        <small className="text-sm font-medium text-(--subfund-foreground)">
          {resourceCountLabel}
        </small>
      </div>
    </div>
  );
};
