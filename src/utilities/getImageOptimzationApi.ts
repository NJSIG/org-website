import { getServerSideUrl } from './getServerSideUrl';

export const getImageOptimizationApi = () => {
  const apiUrl = process.env.NEXT_PUBLIC_IMAGE_OPTIMIZATION_API;

  if (apiUrl) {
    return apiUrl;
  }

  const url = getServerSideUrl();

  if (url.includes('preview')) {
    return 'https://i.prem.njsig.org';
  }

  return 'https://i.njsig.org';
};
