'use client';

import { HeroImage, HeroSpinnerBlock as HeroSpinnerBlockProps } from '@/payload-types';
import { Carousel, CarouselContent, CarouselItem } from '@/primitives/ui/carousel';
import { cn } from '@/utilities/cn';
import Image from 'next/image';

type Props = {
  className?: string;
} & HeroSpinnerBlockProps;

export const HeroSpinnerBlock: React.FC<Props> = ({ className, slides }) => {
  return (
    <Carousel className={cn('w-full', className)} orientation="horizontal">
      <CarouselContent>
        {slides &&
          slides.map((slide) => (
            <CarouselItem key={slide.id} className="h-[600px]">
              <Image
                src={(slide.backgroundImage as HeroImage)?.url || ''}
                alt={(slide.backgroundImage as HeroImage)?.alt || ''}
                fill
                sizes="(max-width: 640px) 640px, (max-width: 1280px) 1280px, 2400px"
                unoptimized
              />
            </CarouselItem>
          ))}
      </CarouselContent>
    </Carousel>
  );
};
