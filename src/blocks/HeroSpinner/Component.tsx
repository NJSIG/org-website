'use client';

import { ImageHash } from '@/components/ImageHash';
import { HeroImage, HeroSpinnerBlock as HeroSpinnerBlockProps } from '@/payload-types';
import { Carousel, CarouselContent, CarouselItem } from '@/primitives/ui/carousel';
import { cn } from '@/utilities/cn';

type Props = {
  className?: string;
} & HeroSpinnerBlockProps;

export const HeroSpinnerBlock: React.FC<Props> = ({ className, slides }) => {
  return (
    <Carousel className={cn('w-full', className)} orientation="horizontal">
      <CarouselContent>
        {slides &&
          slides.map((slide, index) => (
            <CarouselItem key={slide.id} className="relative h-[600px]">
              {slide.backgroundImage && (
                <ImageHash
                  src={(slide.backgroundImage as HeroImage)?.url || ''}
                  alt={(slide.backgroundImage as HeroImage)?.alt || ''}
                  fill
                  priority={index === 0}
                  blurhash={(slide.backgroundImage as HeroImage).blurhash}
                  style={{ objectFit: 'cover' }}
                />
              )}
            </CarouselItem>
          ))}
      </CarouselContent>
    </Carousel>
  );
};
