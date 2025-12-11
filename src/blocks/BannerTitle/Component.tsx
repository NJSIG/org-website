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
    <div className={cn('h-[296px] lg:h-[364px] xl:h-[464px] relative')}>
      <div className="absolute top-0 h-[200px] lg:h-[300px] xl:h-[400px] w-screen max-w-full">
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
    </div>
  );
};
