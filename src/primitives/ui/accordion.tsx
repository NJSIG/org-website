'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { SquarePlusIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/utilities/cn';

function Accordion({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('bg-njsig-neutral-tint rounded-3xl mb-4 last:mb-0', className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] flex items-center justify-between gap-4 rounded-3xl p-4 text-left outline-none hover:bg-mix-shade-njsig-neutral-tint/2 cursor-pointer disabled:pointer-events-none w-full [&[data-state=open]>svg>path:last-of-type]:rotate-90',
          className,
        )}
        {...props}
      >
        {children}
        {/* <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" /> */}
        <SquarePlusIcon
          size={24}
          className="[&>path]:origin-center [&>path:last-of-type]:rotate-0 [&>path:last-of-type]:motion-safe:transition-transform [&>path:last-of-type]:duration-200 pointer-events-none shrink-0"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden"
      // className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn('p-4 pt-8', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
