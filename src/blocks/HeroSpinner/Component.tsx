'use client';

import { useScreenSize } from '@/components/hooks/useScreenSize';
import { cssVariables } from '@/css-variables';
import { HeroSpinnerBlock as HeroSpinnerBlockProps } from '@/payload-types';
import { cn } from '@/utilities/cn';
import { useEffect, useState } from 'react';
import HeroSlide from './components/Slide';

const { breakpoints } = cssVariables;

export const HeroSpinnerBlock: React.FC<HeroSpinnerBlockProps> = ({ slideTimeout, slides }) => {
  const [selectedSlide, setSelectedSlide] = useState<number>(0);
  const { screenSize, initializeScreenSize } = useScreenSize();
  const slidesData = slides || [];

  useEffect(() => {
    initializeScreenSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Don't auto-advance on small screens or when there are no slides
    if (
      screenSize.width === undefined ||
      screenSize.width < breakpoints.md ||
      slidesData.length === 0
    ) {
      return;
    }

    const timeout = setTimeout(
      () => {
        setSelectedSlide((prev) => (prev + 1) % slidesData.length);
      },
      (slideTimeout || 5) * 1000,
    );

    return () => clearTimeout(timeout);
  }, [slidesData.length, slideTimeout, screenSize.width, selectedSlide]);

  if (slidesData.length === 0) {
    return null;
  }

  return (
    <div className="relative @container [&+section]:2xl:pt-10">
      {slidesData.map((slide, index) => (
        <HeroSlide
          key={slide.id}
          slide={slide}
          isActive={index === selectedSlide}
          isPriority={index === 0}
        />
      ))}
      <div className="flex gap-4 items-center absolute right-8 bottom-9 z-20 @5xl:@max-9xl:-rotate-8 @5xl:@max-7xl:bottom-24 @7xl:@max-9xl:bottom-32 @9xl:gap-2 @9xl:p-2 @9xl:rounded-[14px] @9xl:bg-njsig-neutral-background/30">
        {slidesData.map((_, index) => (
          <button
            key={index}
            className={cn(
              'rounded-full border-njsig-accent-shade border-2 w-4 h-4 @9xl:h-3 @9xl:w-3',
              {
                'bg-njsig-accent-shade': index === selectedSlide,
                'hover:bg-njsig-accent-shade/35': index !== selectedSlide,
              },
            )}
            onClick={() => setSelectedSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};
