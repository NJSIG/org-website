import { Metadata } from 'next';
import { getServerSideUrl } from './getServerSideUrl';

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    "New Jersey Schools Insurance Group is NJ's largest school board insurance group serving NJ schools. We provide specialized coverage and personalized claims handling without profit motivation.",
  images: [
    {
      url: `${getServerSideUrl()}/assets/og/njsig-keeping-dollars-in-the-classroom.webp`,
    },
  ],
  siteName: 'New Jsersey Schools Insurance Group',
  title: 'New Jersey Schools Insurance Group',
};

/**
 * Merges the provided open graph metadata with default values.
 *
 * @param og - The open graph metadata to merge with the default values.
 * @returns The merged open graph metadata.
 */
export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  };
};
