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

  if (isLocal && process.env.NODE_ENV === 'development') {
    console.log('Image Loader - Development Mode:', `${baseSrc}?${query.toString()}`);
    return `${baseSrc}?${query.toString()}`;
  }

  if (isLocal) {
    console.log(
      'Image Loader - Local Mode:',
      `${imageOptimizationApi}/image/${fullSrc}?${query.toString()}`,
    );
    return `${imageOptimizationApi}/image/${fullSrc}?${query.toString()}`;
  }

  console.log(
    'Image Loader - External Mode:',
    `${imageOptimizationApi}/image/${baseSrc}?${query.toString()}`,
  );
  return `${imageOptimizationApi}/image/${baseSrc}?${query.toString()}`;
};

export default coolifyImageLoader;
