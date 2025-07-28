import { Event } from '@/payload-types';
import { Metadata } from 'next';
import { getServerSideUrl } from './getServerSideUrl';
import { mergeOpenGraph } from './mergeOpenGraph';

/**
 * Generates the complete URL for the image to be used in the metadata.
 * The default URL is constructed using the server URL and a predefined path.
 */
const getImageUrl = (): string => {
  const serverUrl = getServerSideUrl();

  const url = serverUrl + '/assets/og/njsig-keeping-dollars-in-the-classroom.webp';

  return url;
};

/**
 * Generates metadata for a given event.
 * It constructs the title, description, and Open Graph properties based on the event's information.
 * The title is appended with 'NJSIG - Keeping Dollars in the Classroom'.
 */
export const generateEventMetaGraph = async (args: {
  doc: Partial<Event> | null;
}): Promise<Metadata> => {
  const { doc } = args;

  const ogImage = getImageUrl();
  const title = doc?.title
    ? doc?.title + ' | NJSIG - Keeping Dollars in the Classroom'
    : 'NJSIG - Keeping Dollars in the Classroom';
  const description = "NJSIG's event page for " + (doc?.title || 'the event');

  return {
    description,
    openGraph: mergeOpenGraph({
      description,
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
