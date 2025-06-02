'use client';

import { HeroSpinnerBlock as HeroSpinnerBlockProps } from '@/payload-types';
import { cn } from '@/utilities/cn';

type Props = {
  className?: string;
} & HeroSpinnerBlockProps;

export const HeroSpinnerBlock: React.FC<Props> = ({ className, slides }) => {
  return (
    <div className={cn('', className)}>
      <p>Hero Spinner Block Works!</p>
    </div>
  );
};
