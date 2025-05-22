'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';

import { IconNames } from '@/fields/lucideIconPicker/types';
import { buttonVariants } from '@/primitives/ui/button-prime';
import { cn } from '@/utilities/cn';
import { cva, VariantProps } from 'class-variance-authority';
import DynamicIcon from '../DynamicIcon';

function Accordion({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

const accordionItemVariants = cva('', {
  variants: {
    border: {
      none: '',
      bottom: 'border-b last:border-b-0',
    },
  },
  defaultVariants: {
    border: 'none',
  },
});

function AccordionItem({
  className,
  border,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item> &
  VariantProps<typeof accordionItemVariants>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(accordionItemVariants({ border }), className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  icon,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & { icon?: IconNames }) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          buttonVariants({ variant: 'button', style: 'ghost', size: 'medium' }),
          'w-full justify-end [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg]:duration-100 [&[data-state=closed]>svg]:duration-200 [>svg]:transition-transform',
          className,
        )}
        {...props}
      >
        {children}

        {/* Default Chevron Icon */}
        {!icon && <ChevronDownIcon aria-hidden="true" />}

        {/* Custom Icon */}
        {icon && <DynamicIcon name={icon} aria-hidden="true" />}
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
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn('pt-0 pb-4', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
