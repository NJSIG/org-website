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

  return result;
};

export default coolifyImageLoader;
