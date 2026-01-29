import { CalloutCard } from '@/components/CalloutCard';
import TitleTheme from '@/components/TitleTheme';
import { BannerTitleBlock as BannerTitleBlockProps, HeroImage } from '@/payload-types';
import { blurDataToBlurDataURL } from '@/utilities/blurDataToBlurDataURL';
import { cn } from '@/utilities/cn';
import { getMediaUrl } from '@/utilities/getMediaUrl';
import heroImageLoader from '@/utilities/heroImageLoader';
import Image from 'next/image';

export const BannerTitleBlock: React.FC<BannerTitleBlockProps> = ({ image, theme, title }) => {
  const imageData = {
    url: getMediaUrl((image as HeroImage)?.url, (image as HeroImage)?.updatedAt),
    alt: (image as HeroImage)?.alt || '',
    blurData: blurDataToBlurDataURL((image as HeroImage).blurData),
    customPositioning: (image as HeroImage).customPositioning,
  };

  const customPositions: Record<`--${string}`, string> = {};
  const applyCustomPosition = (
    enabled: boolean | null | undefined,
    xPos: string | null | undefined,
    yPos: string | null | undefined,
    hVar: `--${string}`,
    vVar: `--${string}`,
  ) => {
    if (!enabled) {
      return;
    }

    if (xPos != null) {
      customPositions[hVar] = xPos;
    }

    if (yPos != null) {
      customPositions[vVar] = yPos;
    }
  };

  applyCustomPosition(
    imageData.customPositioning?.smallScreens?.enabled,
    imageData.customPositioning?.smallScreens?.xPos,
    imageData.customPositioning?.smallScreens?.yPos,
    '--hero-h-pos',
    '--hero-v-pos',
  );

  applyCustomPosition(
    imageData.customPositioning?.mediumScreens?.enabled,
    imageData.customPositioning?.mediumScreens?.xPos,
    imageData.customPositioning?.mediumScreens?.yPos,
    '--hero-h-pos-lg',
    '--hero-v-pos-lg',
  );

  applyCustomPosition(
    imageData.customPositioning?.largeScreens?.enabled,
    imageData.customPositioning?.largeScreens?.xPos,
    imageData.customPositioning?.largeScreens?.yPos,
    '--hero-h-pos-xl',
    '--hero-v-pos-xl',
  );

  const style = customPositions as React.CSSProperties;

  return (
    <div
      className={cn('h-74 lg:h-91 xl:h-116 relative flex items-end justify-center')}
      style={style}
    >
      <div className="absolute top-0 h-50 lg:h-75 xl:h-100 w-screen max-w-full -z-1">
        <Image
          loader={heroImageLoader}
          src={imageData.url}
          alt={imageData.alt}
          fill
          sizes="100vw"
          priority={true}
          placeholder="blur"
          blurDataURL={imageData.blurData}
          className="object-cover object-[var(--hero-h-pos)_var(--hero-v-pos)] lg:object-[var(--hero-h-pos-lg)_var(--hero-v-pos-lg)] xl:object-[var(--hero-h-pos-xl)_var(--hero-v-pos-xl)]"
        />
      </div>
      <div className="px-4 w-full max-w-section lg:px-0">
        <CalloutCard shadow="right" className="max-w-96">
          {theme && (
            <TitleTheme size="responsive" animated={false} className="mr-auto">
              {theme}
            </TitleTheme>
          )}
          <h2 className="text-xl xl:text-3xl font-extrabold">{title}</h2>
        </CalloutCard>
      </div>
    </div>
  );
};
