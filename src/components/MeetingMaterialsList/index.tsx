import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/primitives/ui/accordion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/primitives/ui/tooltip';
import { useRef } from 'react';
import { useIsTruncated } from '../hooks/useIsTruncated';
import ResourceList from '../ResourceList';
import { MeetingMaterialsData, MeetingMaterialsListProps } from './types';

const MeetingMaterialsList: React.FC<MeetingMaterialsListProps> = ({ meetings, className }) => {
  return (
    <Accordion type="multiple" className={className}>
      {meetings?.map((meeting) => (
        <AccordionItem key={meeting.id} value={meeting.title}>
          <AccordionTrigger>
            <MeetingHeader meeting={meeting} />
          </AccordionTrigger>
          <AccordionContent>
            <ResourceList resources={meeting.resources} nested />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

const MeetingHeader: React.FC<{ meeting: MeetingMaterialsData }> = ({ meeting }) => {
  const startDate = typeof meeting === 'object' ? new Date(meeting.startDate) : null;

  const formattedDate = startDate
    ? new Intl.DateTimeFormat('en-US', { month: 'long', day: '2-digit', year: 'numeric' }).format(
        startDate,
      )
    : undefined;

  const resourceCount =
    typeof meeting === 'object' && meeting.resources
      ? meeting.resources.length <= 0
        ? 'No Items'
        : meeting.resources.length > 1
          ? `${meeting.resources.length} Items`
          : '1 Item'
      : undefined;

  const meetingTitleRef = useRef(null);
  const { isTruncated } = useIsTruncated({ elementRef: meetingTitleRef });

  return (
    <div className="flex items-center gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="grow overflow-hidden">
            {formattedDate && (
              <small className="text-sm text-foreground-muted">{formattedDate}</small>
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
        <small className="text-sm font-medium text-[var(--subfund-foreground)]">
          {resourceCount || 'No Items'}
        </small>
      </div>
    </div>
  );
};

// const MeetingMaterials: React.FC<MeetingMaterialsProps> = ({ event, className }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const startDate = typeof event === 'object' ? new Date(event.startDate) : null;

//   const formattedDate = startDate
//     ? new Intl.DateTimeFormat('en-US', { month: 'long', day: '2-digit', year: 'numeric' }).format(
//         startDate,
//       )
//     : undefined;

//   const resourceCount =
//     typeof event === 'object' && event.resources
//       ? event.resources.length <= 0
//         ? 'No Items'
//         : event.resources.length > 1
//           ? `${event.resources.length} Items`
//           : '1 Item'
//       : undefined;

//   const meetingTitleRef = useRef(null);
//   const { isTruncated } = useIsTruncated({ elementRef: meetingTitleRef });

//   return event ? (
//     <button
//       className={cn(
//         'p-4 bg-njsig-neutral-tint hover:not-disabled:bg-mix-shade-njsig-neutral-tint/2 not-disabled:cursor-pointer rounded-3xl text-left flex flex-col gap-8',
//         className,
//       )}
//       disabled={!event.resources || event.resources.length === 0}
//       onClick={() => {
//         setIsOpen(!isOpen);
//       }}
//     >
//       <div className="flex items-center gap-4">
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <div className="grow overflow-hidden">
//               {formattedDate && (
//                 <small className="text-sm text-foreground-muted">{formattedDate}</small>
//               )}
//               <h4
//                 className="text-lg font-bold whitespace-nowrap overflow-hidden text-ellipsis"
//                 ref={meetingTitleRef}
//               >
//                 {event.title}
//               </h4>
//             </div>
//           </TooltipTrigger>
//           {isTruncated && <TooltipContent>{event.title}</TooltipContent>}
//         </Tooltip>
//         <div className="flex items-center gap-4">
//           <small className="text-sm font-medium text-[var(--subfund-foreground)]">
//             {resourceCount || 'No Items'}
//           </small>
//           <SquarePlusIcon
//             size={24}
//             className={cn(
//               '[&>path]:origin-center [&>path:last-of-type]:rotate-0 [&>path:last-of-type]:motion-safe:transition-transform',
//               {
//                 '[&>path:last-of-type]:rotate-90': isOpen,
//               },
//             )}
//           />
//         </div>
//       </div>
//       {isOpen && <ResourceList resources={event.resources} nested />}
//     </button>
//   ) : null;
// };

export default MeetingMaterialsList;
