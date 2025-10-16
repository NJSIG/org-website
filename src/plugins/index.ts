import { revalidateRedirectsHook } from '@/hooks';
import { Page } from '@/payload-types';
import { getServerSideUrl } from '@/utilities/getServerSideUrl';
import { redirectsPlugin } from '@payloadcms/plugin-redirects';
import { seoPlugin } from '@payloadcms/plugin-seo';
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types';
import { s3Storage } from '@payloadcms/storage-s3';
import { Plugin } from 'payload';

// Validate and extract required S3 environment variables
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

const requiredS3Vars = {
  S3_BUCKET: requireEnv('S3_BUCKET'),
  S3_ACCESS_KEY_ID: requireEnv('S3_ACCESS_KEY_ID'),
  S3_SECRET_ACCESS_KEY: requireEnv('S3_SECRET_ACCESS_KEY'),
} as const;

const generateTitle: GenerateTitle<Page> = ({ doc }) => {
  return doc?.title
    ? `${doc.title} | NJSIG - Keeping Dollars in the Classroom`
    : 'NJSIG - Keeping Dollars in the Classroom';
};

const generateURL: GenerateURL<Page> = ({ doc }) => {
  const url = getServerSideUrl();

  return doc?.slug ? `${url}/${doc.slug}` : url;
};

export const plugins: Plugin[] = [
  s3Storage({
    collections: {
      'contact-portraits': true,
      documents: true,
      'hero-images': true,
      media: true,
    },
    bucket: requiredS3Vars.S3_BUCKET,
    config: {
      credentials: {
        accessKeyId: requiredS3Vars.S3_ACCESS_KEY_ID,
        secretAccessKey: requiredS3Vars.S3_SECRET_ACCESS_KEY,
      },
    },
  }),
  redirectsPlugin({
    collections: ['pages'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            };
          }
          return field;
        });
      },
      hooks: {
        afterChange: [revalidateRedirectsHook],
      },
      admin: {
        group: 'Administration',
      },
    },
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
];
