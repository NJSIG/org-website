'use client';

import { cssVariables } from '@/css-variables';
import { Media } from '@/payload-types';
import { blurDataToBlurDataURL } from '@/utilities/blurDataToBlurDataURL';
import { cn } from '@/utilities/cn';
import coolifyImageLoader from '@/utilities/coolifyImageLoader';
import { getMediaUrl } from '@/utilities/getMediaUrl';
import Image, { StaticImageData } from 'next/image';
import { MediaProps } from '../types';

const { breakpoints } = cssVariables;

export const ImageMedia: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    pictureClassName,
    imgClassName,
    priority,
    placeholder,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
    loading: loadingFromProps,
    height: heightFromProps,
    width: widthFromProps,
    quality = 100,
  } = props;

  let width: number | undefined;
  let height: number | undefined;
  let alt = altFromProps;
  let src: StaticImageData | string = srcFromProps || '';

  if (!src && resource && typeof resource === 'object') {
    const {
      alt: altFromResource,
      height: heightFromResource,
      width: widthFromResource,
      url,
    } = resource;

    width = widthFromProps || widthFromResource!;
    height = heightFromProps || heightFromResource!;
    alt = altFromResource || '';

    const cacheTag = resource.updatedAt;

    src = getMediaUrl(url, cacheTag);
  }

  const loading = loadingFromProps || (!priority ? 'lazy' : undefined);

  // NOTE: Used by the browser to determine which image to download at different screen sizes
  const sizes = sizeFromProps
    ? sizeFromProps
    : Object.entries(breakpoints)
        .map(([, value]) => `(max-width: ${value}px) ${value * 2}w`)
        .join(', ');

  return (
    <picture className={cn(pictureClassName)}>
      <Image
        src={src}
        alt={alt || ''}
        className={cn(imgClassName)}
        fill={fill}
        sizes={sizes}
        height={!fill ? height : undefined}
        width={!fill ? width : undefined}
        loading={loading}
        quality={quality}
        placeholder={placeholder === 'blur' ? 'blur' : 'empty'}
        blurDataURL={blurDataToBlurDataURL((resource as Media)?.blurData)}
        loader={coolifyImageLoader}
      />
    </picture>
  );
};
