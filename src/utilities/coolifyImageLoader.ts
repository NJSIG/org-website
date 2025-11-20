import { ImageLoader } from 'next/image';
import { getClientSideUrl } from './getClientSideUrl';

// Cache for loader results to reduce recalculations
const loaderCache = new Map<string, string>();
const CACHE_SIZE_LIMIT = process.env.IMAGE_LOADER_CACHE_SIZE
  ? parseInt(process.env.IMAGE_LOADER_CACHE_SIZE)
  : 50; // Limit cache to 50 entries

const coolifyImageLoader: ImageLoader = ({ src, width, quality }) => {
  const cacheKey = `${src}-${width || 'auto'}-${quality || 'auto'}`;

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

  // Debug logging to help identify the issue
  if (process.env.NODE_ENV === 'production') {
    console.log('coolifyImageLoader debug:', {
      nodeEnv: process.env.NODE_ENV,
      imageOptimizationApi: imageOptimizationApi || 'UNDEFINED',
      hasValue: !!imageOptimizationApi,
      allNextPublicVars: Object.keys(process.env).filter((key) => key.startsWith('NEXT_PUBLIC_')),
    });
  }

  const baseUrl = getClientSideUrl();
  const fullSrc = `${baseUrl}${baseSrc}`;

  if (width) {
    query.set('width', width.toString());
  }

  if (quality) {
    query.set('quality', quality.toString());
  }

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

export default coolifyImageLoader;
