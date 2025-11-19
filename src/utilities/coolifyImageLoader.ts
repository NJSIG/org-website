'use client';

import { ImageLoader } from 'next/image';
import { getClientSideUrl } from './getClientSideUrl';

const coolifyImageLoader: ImageLoader = ({ src, width, quality }) => {
  const isLocal = !src.startsWith('http');

  // Parse the src to extract existing query parameters (like cache tags)
  const [baseSrc, existingQuery] = src.split('?');
  const query = new URLSearchParams(existingQuery || '');

  const imageOptimizationApi = process.env.NEXT_PUBLIC_IMAGE_OPTIMIZATION_API;

  if (process.env.NODE_ENV === 'production' && !imageOptimizationApi) {
    console.warn(
      'WARNING IN coolifyImageLoader:',
      'Environment variable NEXT_PUBLIC_IMAGE_OPTIMIZATION_API is not defined. Please set it in your environment.',
      'Environment:',
      process.env.NODE_ENV,
      'Image Optimization API:',
      imageOptimizationApi,
      'Check',
      process.env.NODE_ENV === 'production' && !imageOptimizationApi,
    );
    // throw new Error(
    //   'Environment variable NEXT_PUBLIC_IMAGE_OPTIMIZATION_API is not defined. Please set it in your environment.',
    // );
  }

  const baseUrl = getClientSideUrl();
  const fullSrc = `${baseUrl}${baseSrc}`;

  if (width) {
    query.set('width', width.toString());
  }

  if (quality) {
    query.set('quality', quality.toString());
  }

  if (isLocal && process.env.NODE_ENV === 'development') {
    return `${baseSrc}?${query.toString()}`;
  }

  if (isLocal) {
    return `${imageOptimizationApi}/image/${fullSrc}?${query.toString()}`;
  }

  return `${imageOptimizationApi}/image/${baseSrc}?${query.toString()}`;
};

export default coolifyImageLoader;
