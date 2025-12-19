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
  };

  return (
    <div
      className={cn('h-[296px] lg:h-[364px] xl:h-[464px] relative flex items-end justify-center')}
    >
      <div className="absolute top-0 h-[200px] lg:h-[300px] xl:h-[400px] w-screen max-w-full -z-1">
        <Image
          loader={heroImageLoader}
          src={imageData.url}
          alt={imageData.alt}
          fill
          sizes="100vw"
          priority={true}
          placeholder="blur"
          blurDataURL={imageData.blurData}
          className="object-cover object-top"
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
