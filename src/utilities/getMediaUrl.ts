import { getClientSideUrl } from './getClientSideUrl';

/**
 * Process media resource URLs to ensure proper format
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) {
    return '';
  }

  // Check if the URL already has http protocol
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return cacheTag ? `${url}?${cacheTag}` : url;
  }

  // Or prepend the client-side URL
  const baseUrl = getClientSideUrl();
  return cacheTag ? `${baseUrl}${url}?${cacheTag}` : `${baseUrl}${url}`;
};
