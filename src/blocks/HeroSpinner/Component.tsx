'use client';

import { Button } from '@/components/Button';
import { useScreenSize } from '@/components/hooks/useScreenSize';
import TitleTheme from '@/components/TitleTheme';
import { cssVariables } from '@/css-variables';
import { LinkAppearanceHelper } from '@/fields/link/types';
import { HeroImage, HeroSpinnerBlock as HeroSpinnerBlockProps } from '@/payload-types';
import { blurDataToBlurDataURL } from '@/utilities/blurDataToBlurDataURL';
import { cn } from '@/utilities/cn';
import localImageLoader from '@/utilities/localImageLoader';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// We limit the options the user can set for the CTA buttons in the CMS
// so we're setting the missing options here
const ctaButtonAppearance: LinkAppearanceHelper<'cta'> = {
  sizeVariant: 'large',
  iconPosition: 'after',
  icon: 'arrow-up-right',
};

const { breakpoints } = cssVariables;

export const HeroSpinnerBlock: React.FC<HeroSpinnerBlockProps> = ({ slideTimeout, slides }) => {
  const [selectedSlide, setSelectedSlide] = useState<number>(0);
  const { screenSize, initializeScreenSize } = useScreenSize();

  useEffect(() => {
    initializeScreenSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO: Replace interval with a timeout that resets on manual slide change
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    const createInterval = () => {
      interval = setInterval(
        () => {
          setSelectedSlide((prev) => (slides && slides.length ? (prev + 1) % slides.length : 0));
        },
        slideTimeout * 1000 || 5000,
      );
    };

    // Disable auto-advance on small screens
    if (screenSize.width === undefined || screenSize.width < breakpoints.md) {
      if (interval !== null) {
        clearInterval(interval);
        interval = null;
      }
    } else {
      // Auto-advance slides every `slideTimeout` seconds or reset the interval on manual slide change
      if (interval === null) {
        createInterval();
      } else {
        clearInterval(interval);
        interval = null;
        createInterval();
      }
    }

    return () => {
      if (interval !== null) {
        clearInterval(interval);
        interval = null;
      }
    };
  }, [slides, slideTimeout, screenSize, selectedSlide]);

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className="relative @container [&+section]:2xl:pt-10">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          data-state={index === selectedSlide ? 'active' : 'inactive'}
          className={cn('h-[465px] xl:h-[600px] group', {
            hidden: index !== selectedSlide,
          })}
        >
          <div className="absolute top-0 h-[380px] lg:h-[465px] xl:h-[600px] w-full">
            <Image
              loader={localImageLoader}
              src={(slide.backgroundImage as HeroImage)?.url || ''}
              alt={(slide.backgroundImage as HeroImage)?.alt || ''}
              fill
              priority={index === 0}
              placeholder="blur"
              blurDataURL={blurDataToBlurDataURL((slide.backgroundImage as HeroImage).blurData)}
              className="object-cover object-bottom-right @5xl:object-[center_right] @5xl:@max-9xl:clip-path-polygon-[0_0,100%_0,100%_70%,0_100%]"
            />
          </div>
          <div
            className={cn(
              'flex flex-col items-center @5xl:items-start gap-6 px-8 py-6 absolute bottom-0 w-full lg:top-0 lg:gap-9 xl:gap-12',
              {
                hidden: index !== selectedSlide,
              },
            )}
          >
            <div className="w-full rounded-3xl backdrop-blur-2xl bg-njsig-neutral-background/40 flex flex-col p-4 gap-1 motion-safe:opacity-0 group-data-[state=active]:motion-safe:animate-to group-data-[state=active]:fade-in delay-200 duration-600 fill-mode-forwards group-data-[state=active]:lg:motion-safe:slide-in-from-bottom-6 @5xl:max-w-[500px] @7xl:max-w-[600px]">
              <TitleTheme className="mr-auto">{slide.theme}</TitleTheme>
              <h2 className="text-2xl @5xl:text-6xl @7xl:text-7xl font-bold @5xl:font-extrabold text-azure-950">
                {slide.headline}
              </h2>
            </div>
            <div className="w-full motion-safe:opacity-0 group-data-[state=active]:motion-safe:animate-to group-data-[state=active]:fade-in delay-200 duration-600 fill-mode-forwards group-data-[state=active]:lg:motion-safe:slide-in-from-bottom-6 lg:delay-300 lg:duration-500">
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
      <div className="flex gap-4 items-center absolute right-8 bottom-9 z-20 @5xl:@max-9xl:-rotate-8 @5xl:@max-7xl:bottom-24 @7xl:@max-9xl:bottom-32 @9xl:gap-2 @9xl:p-2 @9xl:rounded-[14px] @9xl:bg-njsig-neutral-background/30">
        {slides.map((_, index) => (
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
