import { Media as MediaType } from '@/payload-types';
import { StaticImageData } from 'next/image';
import { ElementType, Ref } from 'react';

export interface MediaProps {
  alt?: string;
  className?: string;
  pictureClassName?: string;
  imgClassName?: string;
  videoClassName?: string;
  htmlElement?: ElementType | null;
  ref?: Ref<HTMLImageElement | HTMLVideoElement | null>;

  onClick?: () => void;
  onLoad?: () => void;

  // Next Image
  loading?: 'lazy' | 'eager';
  priority?: boolean | null;
  size?: string;
  fill?: boolean;

  // Payload Media
  resource?: MediaType | string | number | null;

  // Optimized Image
  height?: number | null;
  width?: number | null;

  // Static Media
  src?: StaticImageData;

  // Video Media
  autoPlay?: boolean;
  controls?: boolean;
  controlslist?: ('nodownload' | 'nofullscreen' | 'noremoteplayback')[];
  loop?: boolean;
}
