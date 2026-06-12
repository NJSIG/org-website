import { cn } from '@/utilities/cn';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { EventCardData } from '../types';

type EventCardContainerProps = {
  eventType: EventCardData['eventType'];
  className?: string;
  important?: boolean | null;
  isLink?: boolean;
  asChild?: boolean;
};

function EventCardContainer({
  children,
  eventType,
  className,
  important,
  isLink,
  asChild = false,
  ...props
}: React.ComponentProps<'article'> & EventCardContainerProps) {
  const Comp = asChild ? Slot : 'article';

  return (
    <Comp
      data-slot="article"
      data-event-theme={eventType}
      className={cn(
        'event-theme rounded-3xl group/event-card relative overflow-hidden bg-njsig-neutral-tint p-4',
        {
          'hover:bg-(--event-theme-accent)/15 transition-colors cursor-pointer': isLink,
        },
        {
          'border-2 border-(--event-theme-accent)': important || eventType === 'importantDate',
        },
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export default EventCardContainer;
