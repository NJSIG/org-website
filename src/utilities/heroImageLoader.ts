import { ImageLoader } from 'next/image';

const heroImageLoader: ImageLoader = ({ src, width }) => {
  if (src.startsWith('/api')) {
    const extension = src.split('.').pop() || 'webp';
    const baseSrc = src.replace(`.${extension}`, '');

    // Map requested width to available sizes
    const availableSizes = [640, 960, 1280, 1920, 2400];
    const closestSize =
      availableSizes.find((size) => size >= width) || availableSizes[availableSizes.length - 1];

    return `${baseSrc}-${closestSize}.${extension}`;
  }

  return `${src}`;
};

export default heroImageLoader;
