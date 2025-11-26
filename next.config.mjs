import { withPayload } from '@payloadcms/next/withPayload';

// Verify critical environment variables at build time
console.log('🔍 Build-time environment check:');
console.log(
  '  NEXT_PUBLIC_MAPS_API_KEY:',
  process.env.NEXT_PUBLIC_MAPS_API_KEY ? '✅ SET' : '❌ NOT SET',
);

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
