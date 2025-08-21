'use client';

import { ImageLoader } from 'next/image';

const coolifyImageLoader: ImageLoader = ({ src, width, quality }) => {
  const isLocal = !src.startsWith('http');

  // Parse the src to extract existing query parameters (like cache tags)
  const [baseSrc, existingQuery] = src.split('?');
  const query = new URLSearchParams(existingQuery || '');

  const imageOptimizationApi = process.env.NEXT_PUBLIC_IMAGE_OPTIMIZATION_API;
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  const fullSrc = `${baseUrl}${baseSrc}`;

  if (width) {
    query.set('width', width.toString());
  }

  if (quality) {
    query.set('quality', quality.toString());
  }

  if (isLocal && process.env.NODE_ENV === 'development') {
    return src;
  }

  if (isLocal) {
    return `${imageOptimizationApi}/image/${fullSrc}?${query.toString()}`;
  }

  return `${imageOptimizationApi}/image/${baseSrc}?${query.toString()}`;
};

export default coolifyImageLoader;
