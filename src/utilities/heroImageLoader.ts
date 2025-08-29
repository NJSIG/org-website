import { ImageLoader } from 'next/image';

const heroImageLoader: ImageLoader = ({ src, width }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  // Parse the src to extract existing query parameters (like cache tags)
  const [baseSrc, existingQuery] = src.split('?');
  const query = new URLSearchParams(existingQuery || '');

  if (src.startsWith('/api')) {
    const extension = baseSrc.split('.').pop() || 'webp';
    const baseSrcWithoutExtension = baseSrc.replace(`.${extension}`, '');

    // Map requested width to available sizes
    const availableSizes = [640, 960, 1280, 1920, 2400];
    const closestSize =
      availableSizes.find((size) => size >= width) || availableSizes[availableSizes.length - 1];

    return `${baseSrcWithoutExtension}-${closestSize}.${extension}?${query.toString()}`;
  }

  return `${baseUrl}${baseSrc}?${query.toString()}`;
};

export default heroImageLoader;
