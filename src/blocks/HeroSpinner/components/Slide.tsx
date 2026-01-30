import { ButtonLink } from '@/components/ButtonLink';
import TitleTheme from '@/components/TitleTheme';
import { LinkAppearanceHelper } from '@/fields/link/types';
import { HeroImage, HeroSpinnerBlock as HeroSpinnerBlockProps } from '@/payload-types';
import { applyCustomPosition } from '@/utilities/applyCustomImagePosition';
import { blurDataToBlurDataURL } from '@/utilities/blurDataToBlurDataURL';
import { cn } from '@/utilities/cn';
import { getMediaUrl } from '@/utilities/getMediaUrl';
import heroImageLoader from '@/utilities/heroImageLoader';
import Image from 'next/image';
import { memo, useMemo } from 'react';

// We limit the options the user can set for the CTA buttons in the CMS
// so we're setting the missing options here
const ctaButtonAppearance: LinkAppearanceHelper<'cta'> = {
  sizeVariant: 'large',
  iconPosition: 'after',
  icon: 'arrow-up-right',
};

const HeroSlide = memo<{
  slide: NonNullable<HeroSpinnerBlockProps['slides']>[number];
  isActive: boolean;
  isPriority: boolean;
}>(({ slide, isActive, isPriority }) => {
  const imageData = useMemo(
    () => ({
      url: getMediaUrl(
        (slide.backgroundImage as HeroImage)?.url,
        (slide.backgroundImage as HeroImage)?.updatedAt,
      ),
      alt: (slide.backgroundImage as HeroImage)?.alt || '',
      blurData: blurDataToBlurDataURL((slide.backgroundImage as HeroImage).blurData),
      customPositioning: applyCustomPosition([
        {
          xPos: (slide.backgroundImage as HeroImage).customPositioning?.smallScreens?.xPos,
          yPos: (slide.backgroundImage as HeroImage).customPositioning?.smallScreens?.yPos,
          hVar: '--hero-h-pos',
          vVar: '--hero-v-pos',
        },
        {
          xPos: (slide.backgroundImage as HeroImage).customPositioning?.mediumScreens?.xPos,
          yPos: (slide.backgroundImage as HeroImage).customPositioning?.mediumScreens?.yPos,
          hVar: '--hero-h-pos-lg',
          vVar: '--hero-v-pos-lg',
        },
        {
          xPos: (slide.backgroundImage as HeroImage).customPositioning?.largeScreens?.xPos,
          yPos: (slide.backgroundImage as HeroImage).customPositioning?.largeScreens?.yPos,
          hVar: '--hero-h-pos-xl',
          vVar: '--hero-v-pos-xl',
        },
      ]),
    }),
    [slide],
  );

  console.log('Blur Data', imageData.blurData);
  console.log('Position', imageData.customPositioning);

  return (
    <div
      data-state={isActive ? 'active' : 'inactive'}
      className={cn('h-116.25 xl:h-150 group', {
        hidden: !isActive,
      })}
    >
      <div
        className="absolute top-0 h-95 lg:h-116.25 xl:h-150 w-screen max-w-full"
        style={imageData.customPositioning}
        suppressHydrationWarning
      >
        <Image
          loader={heroImageLoader}
          src={imageData.url}
          alt={imageData.alt}
          fill
          sizes="100vw"
          priority={isPriority}
          placeholder="blur"
          blurDataURL={imageData.blurData}
          className="object-cover object-[var(--hero-h-pos)_var(--hero-v-pos)] @5xl:object-[var(--hero-h-pos-lg)_var(--hero-v-pos-lg)] @7xl:object-[var(--hero-h-pos-xl)_var(--hero-v-pos-xl)] @5xl:@max-9xl:clip-path-polygon-[0_0,100%_0,100%_70%,0_100%]"
        />
      </div>
      <div
        className={cn(
          'flex flex-col items-center @5xl:items-start gap-6 px-8 py-6 absolute bottom-0 w-full lg:top-0 lg:gap-9 xl:gap-12',
          {
            hidden: !isActive,
          },
        )}
      >
        <div className="w-full rounded-3xl backdrop-blur-2xl bg-njsig-neutral-background/40 flex flex-col p-4 gap-1 motion-safe:opacity-0 group-data-[state=active]:motion-safe:animate-to group-data-[state=active]:fade-in delay-200 duration-600 fill-mode-forwards group-data-[state=active]:lg:motion-safe:slide-in-from-bottom-6 @5xl:max-w-section-content @7xl:max-w-section-wide-content">
          <TitleTheme className="mr-auto">{slide.theme}</TitleTheme>
          <h2 className="text-2xl @5xl:text-6xl @7xl:text-7xl font-bold @5xl:font-extrabold text-azure-950">
            {slide.headline}
          </h2>
        </div>
        <div className="w-full motion-safe:opacity-0 group-data-[state=active]:motion-safe:animate-to group-data-[state=active]:fade-in delay-200 duration-600 fill-mode-forwards group-data-[state=active]:lg:motion-safe:slide-in-from-bottom-6 lg:delay-300 lg:duration-500">
          {slide.heroLink && (
            <ButtonLink
              link={{
                ...slide.heroLink,
                ...ctaButtonAppearance,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
});

HeroSlide.displayName = 'HeroSlide';

export default HeroSlide;
