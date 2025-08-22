import { withPayload } from '@payloadcms/next/withPayload';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './src/utilities/coolifyImageLoader.ts',
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
