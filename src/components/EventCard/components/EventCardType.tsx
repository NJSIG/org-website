import { Event } from '@/payload-types';
import { cn } from '@/utilities/cn';
import {
  BoxesIcon,
  CalendarX2Icon,
  CircleAlertIcon,
  ShapesIcon,
  TriangleIcon,
  UsersIcon,
} from 'lucide-react';

export const EventCardType: React.FC<
  Pick<Event, 'eventType' | 'important'> & { iconSize?: number; className?: string }
> = ({ eventType, important, iconSize = 14, className: classNameFromProps }) => {
  const className = cn(
    'inline-flex items-center gap-1 text-sm text-(--event-theme-shade) shrink-0',
    classNameFromProps,
  );

  switch (eventType) {
    case 'trusteeMeeting':
      return (
        <span className={className}>
          <UsersIcon size={iconSize} />
          {important && <CircleAlertIcon size={iconSize} />}
          <span>Board of Trustees Meeting</span>
        </span>
      );
    case 'subfundMeeting':
      return (
        <span className={className}>
          <BoxesIcon size={iconSize} />
          {important && <CircleAlertIcon size={iconSize} />}
          <span>Sub-fund Meeting</span>
        </span>
      );
    case 'njsigEvent':
      return (
        <span className={className}>
          <TriangleIcon size={iconSize} />
          {important && <CircleAlertIcon size={iconSize} />}
          <span>NJSIG Event</span>
        </span>
      );
    case 'otherEvent':
      return (
        <span className={className}>
          <ShapesIcon size={iconSize} />
          {important && <CircleAlertIcon size={iconSize} />}
          <span>Other Event</span>
        </span>
      );
    case 'importantDate':
      return (
        <span className={className}>
          <CircleAlertIcon size={iconSize} />
          <span>Important Date</span>
        </span>
      );
    default:
      return (
        <span className={className}>
          <CalendarX2Icon size={iconSize} />
          {important && <CircleAlertIcon size={iconSize} />}
          <span>Unknown Event Type</span>
        </span>
      );
  }
};
