import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utilities/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all disabled:pointer-events-none [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0  focus-visible:ring-4 cursor-pointer outline-offset-4',
  {
    variants: {
      variant: {
        button: 'rounded-lg font-medium',
        cta: 'rounded-3xl font-bold',
        icon: 'rounded-lg',
      },
      style: {
        flat: '',
        outline: 'bg-transparent border-2',
        ghost: 'bg-transparent',
      },
      color: {
        default: '',
        primary: '',
        accent: '',
      },
      size: {
        small: 'text-sm h-7 px-3 py-1 [&_svg]:size-4 [&_svg]:stroke-1',
        medium: 'text-base h-10 px-4 py-2 [&_svg]:size-6',
        large: 'text-lg h-12 px-6 py-3 [&_svg]:size-6',
      },
    },
    compoundVariants: [
      // [Button, CTA, Icon] Flat | Disabled
      {
        variant: ['button', 'cta', 'icon'],
        style: 'flat',
        color: ['primary', 'accent'],
        class:
          'disabled:text-battleship-gray-800 disabled:bg-battleship-gray-400 dark:disabled:text-battleship-gray-400 dark:disabled:bg-battleship-gray-800',
      },
      // [Button, CTA, Icon] Flat | Primary
      {
        variant: ['button', 'cta', 'icon'],
        style: 'flat',
        color: 'primary',
        class:
          'text-foreground-inverted bg-njsig-shade hover:bg-mix-tint-njsig-shade/10 focus-visible:ring-njsig-shade/40 dark:bg-njsig-tint dark:hover:bg-mix-shade-njsig-tint/10 dark:focus-visible:ring-njsig-tint/40',
      },
      // [Button, CTA, Icon] Flat | Accent
      {
        variant: ['button', 'cta', 'icon'],
        style: 'flat',
        color: 'accent',
        class:
          'text-foreground bg-njsig-accent-primary hover:bg-mix-tint-njsig-accent-primary/10 focus-visible:ring-njsig-accent-primary/40 dark:bg-njsig-accent-midtone dark:hover:bg-mix-shade-njsig-accent-midtone/10 dark:focus-visible:ring-njsig-accent-midtone/40',
      },
      // [Button, CTA] Outline | Disabled
      {
        variant: ['button', 'cta'],
        style: 'outline',
        color: ['primary', 'accent'],
        class:
          'disabled:text-battleship-gray-600 disabled:border-battleship-gray-400 dark:disabled:text-battleship-gray-400 dark:disabled:border-battleship-gray-600',
      },
      // [Button, CTA] Outline | Primary
      {
        variant: ['button', 'cta'],
        style: 'outline',
        color: 'primary',
        class:
          'text-foreground hover:bg-njsig-tint border-njsig-shade focus-visible:ring-njsig-shade/40 dark:text-foreground-inverted dark:hover:bg-njsig-shade dark:border-njsig-midtone dark:focus-visible:ring-njsig-midtone/40',
      },
      // [Button, CTA] Outline | Accent
      {
        variant: ['button', 'cta'],
        style: 'outline',
        color: 'accent',
        class:
          'text-foreground hover:bg-njsig-accent-tint border-njsig-accent-primary focus-visible:ring-njsig-accent-primary/40 dark:text-foreground-inverted dark:hover:bg-dandelion-700 dark:border-njsig-accent-midtone dark:focus-visible:ring-njsig-accent-midtone/40',
      },
      // [Button, Icon] Ghost | Disabled
      {
        variant: ['button', 'icon'],
        style: 'ghost',
        color: ['default', 'primary', 'accent'],
        class: 'disabled:text-battleship-gray-600 dark:disabled:text-battleship-gray-400',
      },
      // [Icon] Ghost | Default
      {
        variant: 'icon',
        style: 'ghost',
        color: 'default',
        class:
          'text-foreground hover:bg-battleship-gray-600/10 focus-visible:ring-battleship-gray-600 dark:text-foreground-inverted dark:hover:bg-battleship-gray-400/10 dark:focus-visible::ring-battleship-gray-400',
      },
      // [Button] Ghost | Primary
      {
        variant: ['button', 'icon'],
        style: 'ghost',
        color: 'primary',
        class:
          'text-foreground hover:bg-njsig-midtone/10 focus-visible:ring-njsig-midtone/40 dark:text-foreground-inverted',
      },
      // [Button] Ghost | Accent
      {
        variant: ['button', 'icon'],
        style: 'ghost',
        color: 'accent',
        class:
          'text-foreground hover:bg-njsig-accent-midtone/10 focus-visible:ring-njsig-accent-midtone/40 dark:text-foreground-inverted',
      },
      // [Icon] Medium
      {
        variant: 'icon',
        size: 'medium',
        class: 'h-10 w-10 p-0',
      },
      // [Icon] Small
      {
        variant: 'icon',
        size: 'small',
        class: 'h-7 w-7 p-0',
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

function ButtonPrime({
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
      className={cn(buttonVariants({ variant, style, color, size }), className)}
      {...props}
    />
  );
}

export { ButtonPrime, buttonVariants };
