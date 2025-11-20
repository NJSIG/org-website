import { getClientSideUrl } from './getClientSideUrl';

export const getImageOptimizationApi = () => {
  const apiUrl = process.env.NEXT_PUBLIC_IMAGE_OPTIMIZATION_API;

  if (apiUrl) {
    return apiUrl;
  }

  const url = getClientSideUrl();

  console.log('Client Side URL', url, url.includes('preview'));

  if (url.includes('preview')) {
    return 'https://i.prem.njsig.org';
  }

  return 'https://i.njsig.org';
};
