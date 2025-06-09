import { withPayload } from '@payloadcms/next/withPayload';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    deviceSizes: [640, 960, 1280, 1920, 2400],
    imageSizes: [],
    qualities: [60, 75, 80],
    formats: ['image/webp'],
    loader: 'custom',
    loaderFile: './src/utilities/localImageLoader.ts',
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
