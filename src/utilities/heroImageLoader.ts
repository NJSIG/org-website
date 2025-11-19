import { ImageLoader } from 'next/image';
import { getClientSideUrl } from './getClientSideUrl';

// Cache for loader results to reduce recalculations
const loaderCache = new Map<string, string>();
const CACHE_SIZE_LIMIT = process.env.IMAGE_LOADER_CACHE_SIZE
  ? parseInt(process.env.IMAGE_LOADER_CACHE_SIZE)
  : 50; // Limit cache to 50 entries

const heroImageLoader: ImageLoader = ({ src, width }) => {
  const cacheKey = `${src}-${width}`;

  // Return cached result if available (this moves it to end for LRU)
  if (loaderCache.has(cacheKey)) {
    const cachedResult = loaderCache.get(cacheKey)!;

    // Re-insert to move to end (LRU behavior)
    loaderCache.delete(cacheKey);
    loaderCache.set(cacheKey, cachedResult);

    return cachedResult;
  }

  const isLocal = !src.startsWith('http');

  // Parse the src to extract existing query parameters (like cache tags)
  const [baseSrc, existingQuery] = src.split('?');
  const query = new URLSearchParams(existingQuery || '');

  const imageOptimizationApi = process.env.NEXT_PUBLIC_IMAGE_OPTIMIZATION_API;

  // Only log warning once to reduce console spam
  if (process.env.NODE_ENV === 'production' && !imageOptimizationApi) {
    console.warn(
      'WARNING IN heroImageLoader:',
      'Environment variable NEXT_PUBLIC_IMAGE_OPTIMIZATION_API is not defined. Please set it in your environment.',
      'Environment:',
      process.env.NODE_ENV,
      'Image Optimization API:',
      imageOptimizationApi,
      'Check',
      process.env.NODE_ENV === 'production' && !imageOptimizationApi,
    );
  }

  const baseUrl = getClientSideUrl();
  const cleanSrc = baseSrc.replace(`.${baseSrc.split('.').pop() || 'webp'}`, '');

  // Map requested width to available sizes
  const sizes = [640, 960, 1280, 1920, 2400];
  const nearestSize = sizes.find((size) => size >= width) || sizes[sizes.length - 1];

  const fullSrc = `${baseUrl}${cleanSrc}-${nearestSize}.webp`;

  let result: string;

  if (isLocal && process.env.NODE_ENV === 'development') {
    result = `${baseSrc}?${query.toString()}`;
  } else if (isLocal) {
    result = `${imageOptimizationApi}/image/${fullSrc}?${query.toString()}`;
  } else {
    result = `${imageOptimizationApi}/image/${baseSrc}?${query.toString()}`;
  }

  // Cache the result with LRU eviction
  if (loaderCache.size >= CACHE_SIZE_LIMIT) {
    // Remove oldest entry (first key in Map)
    const firstKey = loaderCache.keys().next().value;

    if (firstKey) {
      loaderCache.delete(firstKey);
    }
  }

  loaderCache.set(cacheKey, result);

  return result;
};

export default heroImageLoader;
