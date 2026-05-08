import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';
import path from 'path';
import { fileURLToPath } from 'url';
import { redirects } from './redirects';

const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);

// Next.js configuration
/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // Temporarily required on Windows until Next.js fixes Turbopack Sass resolution.
  // See: https://github.com/vercel/next.js/issues/86431
  sassOptions: {
    loadPaths: ['./node_modules/@payloadcms/ui/dist/scss/'],
  },
  images: {
    loader: 'custom',
    loaderFile: './src/utilities/coolifyImageLoader.ts',
    qualities: [60, 75, 80, 90, 100],
  },
  reactStrictMode: true,
  redirects,
  turbopack: {
    root: path.resolve(dirname),
    resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.mdx', '.json'],
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
