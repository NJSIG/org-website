import { ImageLoader } from 'next/image';
import { getClientSideUrl } from './getClientSideUrl';

const heroImageLoader: ImageLoader = ({ src, width }) => {
  const isLocal = !src.startsWith('http');

  // Parse the src to extract existing query parameters (like cache tags)
  const [baseSrc, existingQuery] = src.split('?');
  const query = new URLSearchParams(existingQuery || '');

  const imageOptimizationApi = process.env.NEXT_PUBLIC_IMAGE_OPTIMIZATION_API;

  if (process.env.NODE_ENV === 'production' && !imageOptimizationApi) {
    throw new Error(
      'Environment variable NEXT_PUBLIC_IMAGE_OPTIMIZATION_API is not defined. Please set it in your environment.',
    );
  }

  const baseUrl = getClientSideUrl();
  const cleanSrc = baseSrc.replace(`.${baseSrc.split('.').pop() || 'webp'}`, '');

  // Map requested width to available sizes
  const sizes = [640, 960, 1280, 1920, 2400];
  const nearestSize = sizes.find((size) => size >= width) || sizes[sizes.length - 1];

  const fullSrc = `${baseUrl}${cleanSrc}-${nearestSize}.webp`;

  if (isLocal && process.env.NODE_ENV === 'development') {
    return `${baseSrc}?${query.toString()}`;
  }

  if (isLocal) {
    return `${imageOptimizationApi}/image/${fullSrc}?${query.toString()}`;
  }

  return `${imageOptimizationApi}/image/${baseSrc}?${query.toString()}`;
};

export default heroImageLoader;
