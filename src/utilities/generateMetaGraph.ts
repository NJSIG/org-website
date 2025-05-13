import { Config, Media, Page } from '@/payload-types';
import { Metadata } from 'next';
import { getServerSideUrl } from './getServerSideUrl';
import { mergeOpenGraph } from './mergeOpenGraph';

/**
 * Generates the complete URL for the image to be used in the metadata.
 * If the image is an object, it checks for the 'og' size URL first.
 * If the 'og' size URL is not available, it falls back to the default URL.
 * If the image is not an object or is null, it returns a default URL.
 * The default URL is constructed using the server URL and a predefined path.
 */
const getImageUrl = (image?: Media | Config['db']['defaultIDType'] | null): string => {
  const serverUrl = getServerSideUrl();

  let url = serverUrl + '/assets/og/njsig-keeping-dollars-in-the-classroom.webp';

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url;

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url;
  }

  return url;
};

/**
 * Generates metadata for a given document.
 * It constructs the title, description, and Open Graph properties based on the document's meta information.
 * The title is appended with 'NJSIG - Keeping Dollars in the Classroom'.
 */
export const generateMetaGraph = async (args: { doc: Partial<Page> | null }): Promise<Metadata> => {
  const { doc } = args;

  const ogImage = getImageUrl(doc?.meta?.image);
  const title = doc?.meta?.title
    ? doc?.meta?.title + ' | NJSIG - Keeping Dollars in the Classroom'
    : 'NJSIG - Keeping Dollars in the Classroom';

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  };
};
