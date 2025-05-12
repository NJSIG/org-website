import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utilities/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all disabled:pointer-events-none [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
  {
    variants: {
      variant: {
        button: 'rounded-lg font-medium',
        cta: 'rounded-3xl font-bold',
        icon: 'rounded-lg',
      },
      style: {
        flat: '',
        outline: 'border-2',
        ghost: '',
      },
      color: {
        default: '',
        primary: '',
        accent: '',
      },
      size: {
        small: 'text-sm [&_svg]:size-4 [&_svg]:stroke-1',
        medium: 'text-base [&_svg]:size-6',
        large: 'text-lg [&_svg]:size-6',
      },
    },
    compoundVariants: [
      // Disabled Flat Button & CTA
      {
        variant: ['button', 'cta'],
        style: 'flat',
        color: ['primary', 'accent'],
        class:
          'disabled:text-battleship-gray-800 disabled:bg-battleship-gray-400 dark:disabled:text-battleship-gray-400 dark:disabled:bg-battleship-gray-800',
      },
      // Disabled Outline Button & CTA
      {
        variant: ['button', 'cta'],
        style: 'outline',
        color: ['primary', 'accent'],
        class:
          'bg-transparent disabled:text-battleship-gray-600 disabled:border-battleship-gray-400 dark:disabled:text-battleship-gray-400 dark:disabled:border-battleship-gray-600',
      },
      // Disabled Ghost & Icon Buttons
      {
        variant: ['button', 'icon'],
        style: 'ghost',
        color: ['default', 'primary', 'accent'],
        class:
          'bg-transparent disabled:text-battleship-gray-600 dark:disabled:text-battleship-gray-400',
      },
      // Primary Flat Button & CTA
      {
        variant: ['button', 'cta'],
        style: 'flat',
        color: 'primary',
        class: 'text-foreground-inverted bg-njsig-shade hover:bg-tint-njsig-shade/10',
      },
    ],
    defaultVariants: {
      variant: 'button',
      style: 'flat',
      color: 'primary',
      size: 'medium',
    },
  },
);

function Button({
  className,
  variant,
  style,
  color,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, style, color, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
