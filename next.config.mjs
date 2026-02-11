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
  publicRuntimeConfig: {
    PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    PLAUSIBLE_HOST: process.env.NEXT_PUBLIC_PLAUSIBLE_HOST,
    PLAUSIBLE_ON_LOCALHOST: process.env.NEXT_PUBLIC_PLAUSIBLE_ON_LOCALHOST,
    MAPS_API_KEY: process.env.NEXT_PUBLIC_MAPS_API_KEY,
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
