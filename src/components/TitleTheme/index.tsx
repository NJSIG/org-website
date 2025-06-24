import { cn } from '@/utilities/cn';
import { cva } from 'class-variance-authority';

const containerVariants = cva('inline-flex flex-col', {
  variants: {
    size: {
      small: 'gap-1.5',
      medium: 'gap-2',
      responsive: 'gap-1.5 lg:gap-2',
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
  },
});

export default function TitleTheme({
  size = 'medium',
  className,
  children,
}: {
  size?: 'small' | 'medium' | 'responsive';
  className?: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className={cn(containerVariants({ size }), className)}>
      <p className={cn(textVariants({ size }))}>{children}</p>
      <span className={cn(underlineVariants({ size }))}></span>
    </div>
  );
}
