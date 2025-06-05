'use client';

import { Button } from '@/components/Button';
import TitleTheme from '@/components/TitleTheme';
import { LinkAppearanceHelper } from '@/fields/link/types';
import { HeroSpinnerBlock as HeroSpinnerBlockProps, Media } from '@/payload-types';
import { blurDataToBlurDataURL } from '@/utilities/blurDataToBlurDataURL';
import { cn } from '@/utilities/cn';
import Image from 'next/image';
import { useState } from 'react';

// We limit the options the user can set for the CTA buttons in the CMS
// so we're adding setting the missing options here
const ctaButtonAppearance: LinkAppearanceHelper<'cta'> = {
  sizeVariant: 'large',
  iconPosition: 'after',
  icon: 'arrow-up-right',
};

export const HeroSpinnerBlock: React.FC<HeroSpinnerBlockProps> = ({ slides }) => {
  const [selectedSlide, setSelectedSlide] = useState<number>(0);

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn('h-[465px] relative', {
            hidden: index !== selectedSlide,
          })}
        >
          <div className="absolute top-0 h-[380px] w-full">
            <Image
              src={(slide.backgroundImage as Media)?.url || ''}
              alt={(slide.backgroundImage as Media)?.alt || ''}
              fill
              priority={index === 0}
              placeholder="blur"
              blurDataURL={blurDataToBlurDataURL((slide.backgroundImage as Media).blurData)}
              className="object-cover object-bottom-right"
            />
          </div>
          <div className="flex flex-col items-center gap-6 px-8 py-6 absolute bottom-0 w-full">
            <div className="w-full rounded-3xl backdrop-blur-2xl bg-njsig-neutral-background/40 flex flex-col p-4 gap-1">
              <TitleTheme className="mr-auto">{slide.theme}</TitleTheme>
              <h2 className="text-2xl font-bold text-azure-950">{slide.headline}</h2>
            </div>
            <div className="w-full">
              {slide.heroLink && (
                <Button
                  link={{
                    ...slide.heroLink,
                    ...ctaButtonAppearance,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      ))}
      <div className="flex gap-4 items-center absolute right-8 bottom-9">
        {slides.map((_, index) => (
          <button
            key={index}
            className={cn('w-4 h-4 rounded-full border-njsig-accent-shade border-2', {
              'bg-njsig-accent-shade': index === selectedSlide,
              'hover:bg-njsig-accent-shade/35': index !== selectedSlide,
            })}
            onClick={() => setSelectedSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

// <Carousel className={cn('w-full', className)} orientation="horizontal">
//   <CarouselContent>
//     {slides &&
//       slides.map((slide, index) => (
//         <CarouselItem key={slide.id}>
//           {slide.backgroundImage && (
//             <div className="h-[465px] relative flex flex-col">
//               <div className="absolute top-0 h-[380px] w-full">
//                 <Image
//                   src={(slide.backgroundImage as Media)?.url || ''}
//                   alt={(slide.backgroundImage as Media)?.alt || ''}
//                   fill
//                   priority={index === 0}
//                   placeholder="blur"
//                   blurDataURL={blurDataToBlurDataURL((slide.backgroundImage as Media).blurData)}
//                   className="object-cover object-bottom-right"
//                 />
//               </div>
//               <div className="flex flex-col items-center gap-6 py-6 px-8 mt-auto">
//                 <div className='flex items-center justify-around'>
//                   {slide.heroLink && (
//                     <Button
//                       link={{
//                         ...slide.heroLink,
//                         ...ctaButtonAppearance,
//                       }}
//                     />
//                   )}
//                   <div className='flex items-center gap-4'>
//                     {{slides}}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </CarouselItem>
//       ))}
//   </CarouselContent>
// </Carousel>
