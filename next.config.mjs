import { withPayload } from '@payloadcms/next/withPayload';

// Next.js configuration
/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.mdx', '.json'],
  },
  images: {
    loader: 'custom',
    loaderFile: './src/utilities/coolifyImageLoader.ts',
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
