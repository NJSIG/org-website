'use client';

import { ImageLoader } from 'next/image';
import { getClientSideUrl } from './getClientSideUrl';
import { getImageOptimizationApi } from './getImageOptimizationApi';

const heroImageLoader: ImageLoader = ({ src, width }) => {
  const isLocal = !src.startsWith('http');

  // Parse the src to extract existing query parameters (like cache tags)
  const [baseSrc, existingQuery] = src.split('?');
  const query = new URLSearchParams(existingQuery || '');

  const imageOptimizationApi = getImageOptimizationApi();

  // Debug logging to help identify the issue
  if (process.env.NODE_ENV === 'production') {
    console.log('heroImageLoader debug:', {
      nodeEnv: process.env.NODE_ENV,
      imageOptimizationApi: imageOptimizationApi || 'UNDEFINED',
      hasValue: !!imageOptimizationApi,
    });
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

  return result;
};

export default heroImageLoader;
