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
  const { screenSize } = useScreenSize();
  const slidesData = slides || [];

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
    <div className="@container relative [&+section]:2xl:pt-10">
      {slidesData.map((slide, index) => (
        <HeroSlide
          key={slide.id}
          slide={slide}
          isActive={index === selectedSlide}
          isPriority={index === 0}
        />
      ))}
      <div className="@5xl:@max-9xl:-rotate-8 @5xl:@max-7xl:bottom-24 @7xl:@max-9xl:bottom-32 @9xl:gap-2 @9xl:p-2 @9xl:rounded-[14px] @9xl:bg-njsig-neutral-background/30 absolute bottom-9 right-8 z-20 flex items-center gap-4">
        {slidesData.map((_, index) => (
          <button
            key={index}
            className={cn(
              'border-njsig-accent-shade @9xl:h-3 @9xl:w-3 h-4 w-4 rounded-full border-2',
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
