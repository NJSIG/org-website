'use client';

import { ImageLoader } from 'next/image';
import { getClientSideUrl } from './getClientSideUrl';
import { getImageOptimizationApi } from './getImageOptimizationApi';

const coolifyImageLoader: ImageLoader = ({ src, width, quality }) => {
  const isLocal = !src.startsWith('http');

  // Parse the src to extract existing query parameters (like cache tags)
  const [baseSrc, existingQuery] = src.split('?');
  const query = new URLSearchParams(existingQuery || '');

  const imageOptimizationApi = getImageOptimizationApi();

  const baseUrl = getClientSideUrl();
  const fullSrc = `${baseUrl}${baseSrc}`;

  console.log('Coolify Image Loader got base url:', baseUrl);

  if (width) {
    query.set('width', width.toString());
  }

  if (quality) {
    query.set('quality', quality.toString());
  }

  let result: string;

  if (isLocal && process.env.NODE_ENV === 'development') {
    result = `${baseSrc}?${query.toString()}`;
    console.log('Using local image loader in development mode:', result);
  } else if (isLocal) {
    result = `${imageOptimizationApi}/image/${fullSrc}?${query.toString()}`;
    console.log('Using image optimization API for local image:', result);
  } else {
    result = `${imageOptimizationApi}/image/${baseSrc}?${query.toString()}`;
    console.log('Using image optimization API for external image:', result);
  }

  return result;
};

export default coolifyImageLoader;
