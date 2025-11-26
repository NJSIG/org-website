import { withPayload } from '@payloadcms/next/withPayload';

// Build-time validations for environment variables
if (!process.env.NEXT_PUBLIC_MAPS_API_KEY) {
  throw new Error('Environment variable NEXT_PUBLIC_MAPS_API_KEY is required but not defined.');
}

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
