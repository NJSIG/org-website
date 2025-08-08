import { ImageLoader } from 'next/image';

const localImageLoader: ImageLoader = ({ src, width }) => {
  if (src.startsWith('/api')) {
    const extension = src.split('.').pop() || 'webp';
    const baseSrc = src.replace(`.${extension}`, '');

    // Check if the baseSrc ends with a named size
    const namedSizes = ['thumbnail', 'optimized', 'og', 'sm', 'md', 'lg', 'xl'];
    const hasNamedSize = namedSizes.some((size) => baseSrc.endsWith(`-${size}`));

    if (hasNamedSize) {
      return `${baseSrc}.${extension}`;
    }

    return `${baseSrc}-${width}.${extension}`;
  }

  return `${src}`;
};

export default localImageLoader;
