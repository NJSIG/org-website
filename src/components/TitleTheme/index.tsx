'use client';

import { cn } from '@/utilities/cn';
import { cva } from 'class-variance-authority';
import { useState } from 'react';
import { InView } from 'react-intersection-observer';

const containerVariants = cva('inline-flex flex-col', {
  variants: {
    size: {
      small: 'gap-1.5',
      medium: 'gap-2',
      responsive: 'gap-1.5 lg:gap-2',
    },
    animated: {
      true: 'group',
    },
  },
});

const textVariants = cva('font-bold text-foreground dark:text-foreground-inverted', {
  variants: {
    size: {
      small: 'text-base',
      medium: 'text-lg',
      responsive: 'text-base lg:text-lg',
    },
  },
});

const underlineVariants = cva('bg-njsig-accent-midtone', {
  variants: {
    size: {
      small: 'h-1',
      medium: 'h-1.5',
      responsive: 'h-1 lg:h-1.5',
    },
    animated: {
      true: 'w-0 group-data-[underline=expanded]:w-full transition-all duration-300 delay-100',
    },
  },
});

export default function TitleTheme({
  size = 'medium',
  animated = false,
  className,
  children,
}: {
  size?: 'small' | 'medium' | 'responsive';
  animated?: boolean;
  className?: string;
  children: React.ReactNode;
}): React.JSX.Element {
  const [underlined, setUnderlined] = useState(false);

  if (animated) {
    return (
      <InView
        as="div"
        triggerOnce={true}
        fallbackInView={true}
        threshold={1}
        onChange={(inView) => {
          setUnderlined(inView);
        }}
        data-underline={underlined ? 'expanded' : 'collapsed'}
        className={cn(containerVariants({ size, animated }), className)}
      >
        <p className={textVariants({ size })}>{children}</p>
        <span className={underlineVariants({ size, animated })}></span>
      </InView>
    );
  }

  return (
    <div className={cn(containerVariants({ size }), className)}>
      <p className={textVariants({ size })}>{children}</p>
      <span className={underlineVariants({ size })}></span>
    </div>
  );
}
