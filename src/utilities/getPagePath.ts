import { Page } from '@/payload-types';

type Breadcrumb = {
  url?: string | null;
};

type PagePathSource = Pick<Page, 'slug' | 'breadcrumbs'>;

const normalizePath = (value: string) => {
  if (!value) {
    return '/';
  }

  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`;

  if (withLeadingSlash !== '/' && withLeadingSlash.endsWith('/')) {
    return withLeadingSlash.slice(0, -1);
  }

  return withLeadingSlash;
};

export const getPagePath = (page?: Partial<PagePathSource> | null): string | null => {
  if (!page) {
    return null;
  }

  if (page.slug === 'home') {
    return '/';
  }

  const breadcrumbs = page.breadcrumbs as Breadcrumb[] | null | undefined;
  const breadcrumbPath = breadcrumbs?.[breadcrumbs.length - 1]?.url;

  if (typeof breadcrumbPath === 'string' && breadcrumbPath.length > 0) {
    return normalizePath(breadcrumbPath);
  }

  if (typeof page.slug === 'string' && page.slug.length > 0) {
    return normalizePath(page.slug);
  }

  return null;
};
