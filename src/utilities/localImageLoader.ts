import { ImageLoader } from 'next/image';

const localImageLoader: ImageLoader = ({ src, width }) => {
  if (src.startsWith('/api')) {
    const extension = src.split('.').pop() || 'webp';
    const baseSrc = src.replace(`.${extension}`, '');

    return `${baseSrc}-${width}.${extension}`;
  }

  return `${src}`;
};

export default localImageLoader;
